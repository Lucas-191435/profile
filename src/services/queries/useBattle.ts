import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../api";
import { IBattle, TeamName } from "@/types/IBattle";
import { errorToast } from "@/utils/toasts";

export const useBattleSnapshot = ({ battleId, enabled = true }: { battleId: string; enabled?: boolean }) => {
    return useQuery({
        queryKey: ["battle", battleId],
        queryFn: async (): Promise<IBattle> => {
            const response: { data: IBattle } = await api.get(`/battle/${battleId}`).request;
            return response.data;
        },
        enabled: enabled && !!battleId,
    });
};

export const useCreateBattle = () => {
    return useMutation({
        mutationFn: async (data: { teamName: TeamName }): Promise<{ id: string }> => {
            const response = await api.post("/battle", data).request;
            return response.data;
        },
        onError: (error: AxiosError<{ message: string }>) => {
            errorToast({ description: error.response?.data?.message ?? "Erro ao criar batalha." });
        },
    });
};

export const useJoinBattle = () => {
    return useMutation({
        mutationFn: async (data: { battleId: string; teamName: TeamName }): Promise<{ id: string }> => {
            const response = await api.post(`/battle/${data.battleId}/join`, { teamName: data.teamName }).request;
            return response.data;
        },
        onError: (error: AxiosError<{ message: string }>) => {
            errorToast({ description: error.response?.data?.message ?? "Erro ao entrar na batalha." });
        },
    });
};
