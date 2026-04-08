import { IPokeMove } from "@/types/IPokeMove";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
export const usePokeMove = ({ number, enabled = false }: { number: number, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["poke-move", number],
        queryFn: async (): Promise<IPokeMove[]> => {
            const response: {
                data: {
                    data: {
                        name: string;
                        moves: IPokeMove[];
                    }
                }
            } = await api.get(`/pokemon-move/${number}`).request;
            return response.data.data.moves;
        },
        enabled, // Desabilita a consulta por padrão
    });
}