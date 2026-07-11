'use client';
import { useMessages, useSendMessage, useUpdatePokemonTeam } from "@/services/queries/useChat";
import { IMessage, IMessagesPage, Team, TeamSlot } from "@/types/IChat";
import { useContext, createContext, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface ChatContextType {
    // Mensagens
    messages: IMessage[];
    isLoadingMessages: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    sendMessage: (text: string) => void;
    isSending: boolean;

    // Coleção / time
    myCollection: string[];
    setMyCollection: React.Dispatch<React.SetStateAction<string[]>>;
    teamSelected: "teamAlpha" | "teamBeta" | "teamGamma";
    setTeamSelected: React.Dispatch<React.SetStateAction<"teamAlpha" | "teamBeta" | "teamGamma">>;
    handleSubmitTeam: ({ team }: { team: Team }) => void;

    // Sessão
    currentUserId: string | undefined;

    // WebSocket — preparado para quando for adicionado
    isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const [teamSelected, setTeamSelected] = useState<"teamAlpha" | "teamBeta" | "teamGamma">("teamAlpha");
    const [myCollection, setMyCollection] = useState<string[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("pokemon-collection");
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // WebSocket placeholder — descomente quando instalar o pacote
    // const wsRef = useRef<WebSocket | null>(null);
    const [isConnected] = useState(false);
    // useEffect(() => {
    //     wsRef.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    //     wsRef.current.onopen = () => setIsConnected(true);
    //     wsRef.current.onclose = () => setIsConnected(false);
    //     wsRef.current.onmessage = (event) => {
    //         const msg: IMessage = JSON.parse(event.data);
    //         queryClient.setQueryData(["messages"], (old: any) => { ... });
    //     };
    //     return () => wsRef.current?.close();
    // }, []);

    const {
        data: messagesData,
        isLoading: isLoadingMessages,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useMessages({ enabled: true });

    const sendMessageMutation = useSendMessage();
    const updatePokemonTeam = useUpdatePokemonTeam();

    // API retorna páginas em ordem DESC (mais recentes primeiro).
    // Invertemos para exibir do mais antigo para o mais novo.
    const messages: IMessage[] = messagesData?.pages
        .flatMap((page: IMessagesPage) => page.messages)
        .reverse() ?? [];

    const sendMessage = useCallback(
        (text: string) => {
            if (!text.trim()) return;
            sendMessageMutation.mutate({ text });
            // TODO: também enviar via WebSocket quando instalado
            // wsRef.current?.send(JSON.stringify({ type: "message", text }));
        },
        [sendMessageMutation],
    );

    const handleSubmitTeam = ({ team }: { team: Team }) => {
        updatePokemonTeam.mutate({
            teamName: teamSelected,
            team: team.slots
                .filter((s: TeamSlot) => s.pokemonId !== null)
                .map((s: TeamSlot) => s.pokemonId as string),
        });
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                isLoadingMessages,
                isFetchingNextPage,
                hasNextPage: hasNextPage ?? false,
                fetchNextPage,
                sendMessage,
                isSending: sendMessageMutation.isPending,
                myCollection,
                setMyCollection,
                teamSelected,
                setTeamSelected,
                handleSubmitTeam,
                currentUserId: session?.user?.id,
                isConnected,
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
