import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { IGetPokemons } from "../dto/IUsePokemon";
import { IPokemonComplete } from "@/types/IPokemon";


type UseGetPokemonsParams = {
    page?: number;
    pageSize?: number;
    type?: string;
    gen?: string;
    query?: string;
    types?: string[];
};
export const useGetPokemons = (params: UseGetPokemonsParams) => {
    return useQuery({
        queryKey: ["get-pokemons", {
            page: params.page,
            pageSize: params.pageSize,
            type: params.type,
            gen: params.gen,
            query: params.query,
            types: params.types
        }],
        queryFn: async (): Promise<IGetPokemons> => {
            const queryString = new URLSearchParams({
                page: params.page?.toString() || "1",
                pageSize: params.pageSize?.toString() || "20",
                query: params.query || "",
                types: params.types ? params.types.join(",") : ""
            });
            const response: { data: { data: IGetPokemons } } = await api.get(`/pokemon?${queryString.toString()}`).request;
            return response.data.data;
        },
        staleTime: Infinity, // Dados nunca ficam obsoletos
        enabled: true, // Always enabled to fetch data on mount
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });
};

type UseFindUniquePokemonParams = {
    id?: number;

};
export const useFindUniquePokemon = (params: UseFindUniquePokemonParams) => {
    return useQuery({
        queryKey: ["unique-pokemon", {
            id: params.id
        }],
        queryFn: async (): Promise<IPokemonComplete> => {
            const response: { data: { data: IPokemonComplete } } = await api.get(`/pokemon/${params.id}`).request;
            console.log('useFindUniquePokemon', response.data.data);
            return response.data.data;
        },
        staleTime: Infinity, // Dados nunca ficam obsoletos
        enabled: true, // Always enabled to fetch data on mount
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });
};