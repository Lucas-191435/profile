import { IPokeMove } from "@/types/IPokeMove";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
export const usePokeMove = ({ number }: { number: number }) => {
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
            } = await api.get(`/pokemon/${number}`).request;
            return response.data.data.moves;
        }
    });
}