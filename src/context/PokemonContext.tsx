import React, { createContext, useContext, useState } from "react";
import { useGetPokemons } from "@/services/queries/usePokemon";

// Define the shape of the context
interface PokemonContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    querySearch: string;
    setQuerySearch: React.Dispatch<React.SetStateAction<string>>;
    pokemons: any; // Replace `any` with the correct type if available
}

// Create the context
const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

// Create a provider component
export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [page, setPage] = useState(1);
    const pageSize = 20;
    const [querySearch, setQuerySearch] = useState("");
    const { data: pokemons } = useGetPokemons({ page, pageSize, query: querySearch });

    return (
        <PokemonContext.Provider value={{
            page,
            setPage,
            querySearch,
            setQuerySearch,
            pokemons
        }}>
            {children}
        </PokemonContext.Provider>
    );
};

export const usePokemonContext = () => {
    const context = useContext(PokemonContext);
    if (!context) {
        throw new Error("usePokemonContext must be used within a PokemonProvider");
    }
    return context;
};