import { useMyPokemon } from "@/services/queries/useMyPokemon";
import { IMyPokemon } from "@/types/IMyPokemon";
import { useContext, createContext, useState } from "react";

interface MyPokemonContextType {
    pokemons: IMyPokemon[] | undefined; 
    isLoading: boolean;
    error: any; 
    myCollection: string[];
    setMyCollection: React.Dispatch<React.SetStateAction<string[]>>;
}

const MyPokemonContext = createContext<MyPokemonContextType | undefined>(undefined);

export const MyPokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: pokemons, isLoading, error } = useMyPokemon({ enabled: true });
    const [myCollection, setMyCollection] = useState<string[]>(() => {
            const saved = localStorage.getItem("pokemon-collection");
            return saved ? JSON.parse(saved) : pokemons ? pokemons.map((p) => p.id) : [];
        });
    return (
        <MyPokemonContext.Provider value={{
            pokemons,
            isLoading,
            error,
            myCollection,
            setMyCollection
        }}>
            {children}
        </MyPokemonContext.Provider>
    );
}


export const useMyPokemonContext = () => {
    const context = useContext(MyPokemonContext);
    if (!context) {
        throw new Error("useMyPokemonContext must be used within a MyPokemonProvider");
    }
    return context;
};