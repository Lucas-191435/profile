import React, { createContext, useContext, useState } from "react";
import { useGetPokemons } from "@/services/queries/usePokemon";
import { useDebounce } from "@/hooks/useDebounce";
import { IGetPokemons } from "@/services/dto/IUsePokemon";

export type PokemonFilters = {
    types: string[];
    regions: string[];
};

// Define the shape of the context
interface PokemonContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    querySearch: string;
    pokemons: IGetPokemons | undefined;
    isLoading: boolean;
    error: any;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filters: PokemonFilters;
    activeFiltersCount: number;
    applyFilters: (filters: PokemonFilters) => void;
    clearFilters: () => void;
    clearAll: () => void;
}

const EMPTY_FILTERS: PokemonFilters = { types: [], regions: [] };

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [page, setPage] = useState(1);
    const pageSize = 24;
    const [querySearch, setQuerySearch] = useState("");
    const [filters, setFilters] = useState<PokemonFilters>(EMPTY_FILTERS);
    const debouncedSearch = useDebounce(querySearch, 500);
    const { data: pokemons, isLoading, error } = useGetPokemons({
        page,
        pageSize,
        query: debouncedSearch,
        types: filters.types,
        regions: filters.regions
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuerySearch(e.target.value);
        if (page !== 1) {
            setPage(1);
        }
    }

    const applyFilters = (next: PokemonFilters) => {
        setFilters(next);
        setPage(1);
    }

    const clearFilters = () => applyFilters(EMPTY_FILTERS);

    const clearAll = () => {
        setQuerySearch("");
        clearFilters();
    }

    const activeFiltersCount = filters.types.length + filters.regions.length;

    return (
        <PokemonContext.Provider value={{
            page,
            setPage,
            querySearch,
            handleSearchChange,
            pokemons,
            isLoading,
            error,
            filters,
            activeFiltersCount,
            applyFilters,
            clearFilters,
            clearAll
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
