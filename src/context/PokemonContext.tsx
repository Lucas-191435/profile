import React, { createContext, useContext, useState } from "react";
import { useGetPokemons } from "@/services/queries/usePokemon";
import { useDebounce } from "@/hooks/useDebounce";

// Define the shape of the context
interface PokemonContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    querySearch: string;
    pokemons: any; 
    isLoading: boolean;
    error: any; 
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [page, setPage] = useState(1);
    const pageSize = 20;
    const [querySearch, setQuerySearch] = useState("");
    const debouncedSearch = useDebounce(querySearch, 500);
    const { data: pokemons, isLoading, error } = useGetPokemons({ page, pageSize, query: debouncedSearch });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuerySearch(e.target.value);
        if (page !== 1) {
            setPage(1);
        }
    }

    return (
        <PokemonContext.Provider value={{
            page,
            setPage,
            querySearch,
            handleSearchChange,
            pokemons,
            isLoading,
            error
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