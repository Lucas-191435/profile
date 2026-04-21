import { IPokeMove } from "@/types/IPokeMove";
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { IMyPokemon } from "@/types/IMyPokemon";
import { errorToast, successToast } from "@/utils/toasts";
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

export const useCreatePokemon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newPokemon: any): Promise<any> => {
            const response = await api.post("/my-pokemon/capture", newPokemon).request;
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-pokemon"] });
        },
        onError: (error: AxiosError<{ success: boolean, error: string }>) => {
            console.log("Erro ao capturar Pokémon:", error.response?.data);
        }
    });
};