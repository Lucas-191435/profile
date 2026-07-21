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
    deleteMessage: (messageId: string) => void;
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
    const [deletedMessageIds, setDeletedMessageIds] = useState<Set<string>>(new Set());
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

        const handleDeleteMessage = (message: IMessage) => {
            console.log("Message deleted:", message.id);
            setDeletedMessageIds((prev) => new Set([...prev, message.id]));
            setRealtimeMessages((prev) => prev.filter((m) => m.id !== message.id));
        };

        socket.on("new-message", handleNewMessage);
        socket.on("delete-message", handleDeleteMessage);
        return () => {
            socket.off("new-message", handleNewMessage);
            socket.off("delete-message", handleDeleteMessage);
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

    // Mescla histórico HTTP + mensagens em tempo real, removendo duplicatas e deletadas
    const messages: IMessage[] = [
        ...historicalMessages,
        ...realtimeMessages.filter(
            (rt) => !historicalMessages.some((hm) => hm.id === rt.id),
        ),
    ].filter((m) => !deletedMessageIds.has(m.id));

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

     const deleteMessage = useCallback(
        (messageId: string) => {
            if (!messageId || !currentRoomId) return;
            setIsSending(true);
            socket.emit(
                "delete-message",
                { roomId: currentRoomId, messageId },
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
                deleteMessage,
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
