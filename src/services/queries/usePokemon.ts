import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { IGetPokemons } from "../dto/IUsePokemon";
import { useOptimizedQuery } from "@/shared/helpers/useOptimizedQuery";


export const useGetPokemons = (page: number = 1, pageSize: number = 20) => {
    return useQuery({
        queryKey: ["get-pokemons", page, pageSize],
        queryFn: async (): Promise<IGetPokemons> => {
            const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
            const response = await api.get(`/pokemon?${params.toString()}`).request;
            return response.data;
        },
        staleTime: Infinity, // Dados nunca ficam obsoletos
        enabled: true, // Always enabled to fetch data on mount
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });
};