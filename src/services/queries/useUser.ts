import { IPokeMove } from "@/types/IPokeMove";
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { IMyPokemon } from "@/types/IMyPokemon";
import { errorToast, successToast } from "@/utils/toasts";
import { IUserProps } from "@/types/IUser";
export const useUser = ({ userId, enabled = false }: { userId: string; enabled?: boolean }) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: async (): Promise<IUserProps> => {
            const response: {
                data:  IUserProps
            } = await api.get(`/user/${userId}`).request;

            return response.data;
        },
        enabled, // Desabilita a consulta por padrão
    });
}

export const useUpdateUser = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: {name: string, description: string, avatar: string}): Promise<any> => {
            const response = await api.put(`/user/${userId}`, body).request;
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
            successToast({
                description: "User atualizado!"
            })
        },
        onError: (error: AxiosError<{ success: boolean, error: string }>) => {
            console.log("Erro ao atualizar usuário", error.response?.data);
        }
    });
};


export const useCreateUser = () => {
    // const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: {name: string, email: string,  password: string, avatar: string}): Promise<any> => {
            const response = await api.post(`/user`, body).request;
            return response.data;
        },
        onSuccess: () => {
            successToast({
                description: "User criado com sucesso!"
            })
        },
        onError: (error: AxiosError<{ success: boolean, error: string }>) => {
            console.log("Erro ao criar usuário", error.response?.data);
        }
    });
};
