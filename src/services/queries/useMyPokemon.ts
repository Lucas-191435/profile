import { IPokeMove } from "@/types/IPokeMove";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { IMyPokemon } from "@/types/IMyPokemon";
export const useMyPokemon = ({ enabled = false }: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["my-pokemon"],
        queryFn: async (): Promise<IMyPokemon[]> => {
            const response: {
                data: {
                    data: IMyPokemon[]
                }
            } = await api.get(`/my-pokemon`).request;
            return response.data.data || [];
        },
        enabled, // Desabilita a consulta por padrão
    });
}