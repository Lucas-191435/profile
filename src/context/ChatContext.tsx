'use client';
import { useMessages, useGlobalRoom } from "@/services/queries/useChat";
import { IMessage, IMessagesPage } from "@/types/IChat";
import { useContext, createContext, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";

interface ChatContextType {
    messages: IMessage[];
    isLoadingMessages: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    sendMessage: (text: string) => void;
    isSending: boolean;
    currentUserId: string | undefined;
    isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const { socket, connected } = useSocket();
    const [isSending, setIsSending] = useState(false);
    const [realtimeMessages, setRealtimeMessages] = useState<IMessage[]>([]);
    // console.log("user session:", session);
    // Busca a sala global para obter o roomId necessário no send-message
    const { data: globalRoom } = useGlobalRoom({ enabled: connected });
    const currentRoomId = globalRoom?.id ?? null;

    // Escuta mensagens em tempo real via WebSocket
    useEffect(() => {
        const handleNewMessage = (message: IMessage) => {
            setRealtimeMessages((prev) => {
                if (prev.some((m) => m.id === message.id)) return prev;
                return [...prev, message];
            });
        };

        socket.on("new-message", handleNewMessage);
        return () => {
            socket.off("new-message", handleNewMessage);
        };
    }, [socket]);

    const {
        data: messagesData,
        isLoading: isLoadingMessages,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useMessages({ chatId: currentRoomId ?? "", enabled: true });

    // API retorna páginas em ordem DESC (mais recentes primeiro).
    // Invertemos para exibir do mais antigo para o mais novo.
    const historicalMessages: IMessage[] = messagesData?.pages
        .flatMap((page: IMessagesPage) => page.messages)
        .reverse() ?? [];

    // Mescla histórico HTTP + mensagens em tempo real, removendo duplicatas
    const messages: IMessage[] = [
        ...historicalMessages,
        ...realtimeMessages.filter(
            (rt) => !historicalMessages.some((hm) => hm.id === rt.id),
        ),
    ];

    const sendMessage = useCallback(
        (text: string) => {
            if (!text.trim() || !currentRoomId) return;
            setIsSending(true);
            socket.emit(
                "send-message",
                { roomId: currentRoomId, message: text },
                () => setIsSending(false),
            );
        },
        [socket, currentRoomId],
    );

    return (
        <ChatContext.Provider
            value={{
                messages,
                isLoadingMessages,
                isFetchingNextPage,
                hasNextPage: hasNextPage ?? false,
                fetchNextPage,
                sendMessage,
                isSending,
                currentUserId: session?.user?.id,
                isConnected: connected,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
};
