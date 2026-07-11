import { useLeavePokemon, useChat, useUpdatePokemonTeam } from "@/services/queries/useChat";
import { IChat, Team } from "@/types/IChat";
import { useContext, createContext, useState } from "react";

interface ChatContextType {
    pokemons: IChat[] | undefined;
    isLoading: boolean;
    error: any;
    myCollection: string[];
    setMyCollection: React.Dispatch<React.SetStateAction<string[]>>;
    teamSelected: "teamAlpha" | "teamBeta" | "teamGamma";
    setTeamSelected: React.Dispatch<React.SetStateAction<"teamAlpha" | "teamBeta" | "teamGamma">>;
    handleSubmitTeam: ({ team }: { team: Team }) => void;
}



const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: pokemons, isLoading, error } = useChat({ enabled: true });
    const [teamSelected, setTeamSelected] = useState<"teamAlpha" | "teamBeta" | "teamGamma">("teamAlpha");
    const [myCollection, setMyCollection] = useState<string[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("pokemon-collection");
            return saved ? JSON.parse(saved) : pokemons ? pokemons.map((p) => p.id) : [];
        }
    });
    const updatePokemonTeam = useUpdatePokemonTeam();
    const handleSubmitTeam = ({ team }: { team: Team }) => {
        updatePokemonTeam.mutate({
            teamName: teamSelected,
            team: team.slots.filter((s) => s.pokemonId !== null).map((s) => s.pokemonId as string)
        });
    }
    return (
        <ChatContext.Provider value={{
            pokemons,
            isLoading,
            error,
            myCollection,
            setMyCollection,
            teamSelected,
            setTeamSelected,
            handleSubmitTeam
        }}>
            {children}
        </ChatContext.Provider>
    );
}


export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
};