import { IPokeMove } from "@/types/IPokeMove";
import { AxiosError } from 'axios';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { IMyPokemon } from "@/types/IMyPokemon";
import { IMessage, IMessagesPage } from "@/types/IChat";
import { errorToast, successToast } from "@/utils/toasts";

export const useMessages = ({ enabled = true }: { enabled?: boolean } = {}) => {
    return useInfiniteQuery({
        queryKey: ["messages"],
        queryFn: async ({ pageParam }: { pageParam: string | null }) => {
            const params = new URLSearchParams({ limit: "20" });
            if (pageParam) params.set("cursor", pageParam);

            const response: { data: IMessagesPage } = await api.get(`/messages?${params}`).request;
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialPageParam: null as string | null,
        enabled,
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { text: string }): Promise<IMessage> => {
            const response: { data: IMessage } = await api.post("/messages", data).request;
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
        onError: (error: AxiosError<{ success: boolean; error: string }>) => {
            console.error("Erro ao enviar mensagem:", error.response?.data);
        },
    });
};
export const useMyPokemon = ({ enabled = false }: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["my-pokemon"],
        queryFn: async (): Promise<IMyPokemon[]> => {
            const response: {
                data:  IMyPokemon[]
            } = await api.get(`/my-pokemon`).request;

            return response.data || [];
        },
        enabled, // Desabilita a consulta por padrão
    });
}

export const useCreatePokemon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (capturatedPokemon: { id: string, nickname: string }): Promise<any> => {
            const response = await api.post("/my-pokemon/capture", {
                pokemonId: capturatedPokemon.id,
                nickname: capturatedPokemon.nickname
            }).request;
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

export const useLeavePokemon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pokemonId: string): Promise<any> => {
            const response = await api.delete(`/my-pokemon/leave/${pokemonId}`).request;
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-pokemon"] });
            successToast({ description: "Pokémon removido com sucesso" });
        },
        onError: (error: AxiosError<{ success: boolean, error: string }>) => {
            console.log("Erro ao remover Pokémon:", error.response?.data);
        }
    });
};

export const useUpdatePokemonTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            teamName: string;
            team: string[]
        }): Promise<any> => {
            const response = await api.put(`/my-pokemon/update-team`,
                data
            ).request;
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-pokemon"] });
            successToast({ description: "Pokémon atualizado com sucesso" });
        },
        onError: (error: AxiosError<{ success: boolean, error: string }>) => {
            console.log("Erro ao atualizar Pokémon:", error.response?.data);
        }
    });
};

export const useUpdatePokemonMoves = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            myPokemonId: string;
            teamName: string;
            moves: string[];
        }): Promise<any> => {
            const response = await api.put(`/my-pokemon/update-moves`, data).request;
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-pokemon"] });
            successToast({ description: "Movimentos atualizados com sucesso" });
        },
        onError: (error: AxiosError<{ success: boolean, error: string }>) => {
            console.log("Erro ao atualizar movimentos:", error.response?.data);
        }
    });
};