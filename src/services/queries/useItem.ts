import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { IGetPokemons } from "../dto/IUsePokemon";
import { IPokemonComplete } from "@/types/IPokemon";
import { IGetItems } from "../dto/IUseItem";


type UseGetItemParams = {
    page?: number;
    pageSize?: number;
    type?: string;
    gen?: string;
    query?: string;
    types?: string[];
};
export const useGetItems = (params: UseGetItemParams) => {
    return useQuery({
        queryKey: ["get-items", {
            page: params.page,
            pageSize: params.pageSize,
            type: params.type,
            gen: params.gen,
            query: params.query,
            types: params.types
        }],
        queryFn: async (): Promise<IGetItems> => {
            const queryString = new URLSearchParams({
                page: params.page?.toString() || "1",
                pageSize: params.pageSize?.toString() || "20",
                query: params.query || "",
                types: params.types ? params.types.join(",") : ""
            });
            const response: { data: { data: IGetItems } } = await api.get(`/items?${queryString.toString()}`).request;
            return response.data.data;
        },
        staleTime: Infinity, // Dados nunca ficam obsoletos
        enabled: true, // Always enabled to fetch data on mount
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });
};

