import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../api";
import { BattleStatus, IBattle, IUserTest, TeamName } from "@/types/IBattle";
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

export const useJoinBattleBot = () => {
    return useMutation({
        mutationFn: async (data: { battleId: string; trainerId?: string }): Promise<{ id: string; trainerId: string; trainerName: string }> => {
            const response = await api.post(`/battle/${data.battleId}/join-bot`, data.trainerId ? { trainerId: data.trainerId } : {}).request;
            return response.data;
        },
        onError: (error: AxiosError<{ message: string }>) => {
            errorToast({ description: error.response?.data?.message ?? "Erro ao batalhar contra a CPU." });
        },
    });
};

export const useTestTrainers = ({ enabled = true }: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: ["user-test-trainers"],
        queryFn: async (): Promise<IUserTest[]> => {
            const response: { data: IUserTest[] } = await api.get("/user/users-test").request;
            return response.data;
        },
        enabled,
    });
};

type UseListBattleParams = {
    page?: number;
    pageSize?: number;
    search?: string;
    enabled?: boolean;
};

export type BattleRoom = {
    id: string,
    status: BattleStatus,
    createdAt: string,
    playerA: {
        id: string,
        name: string,
        email: string
    }
}

export type ListBattleResponse = {
    battles: BattleRoom[],
    count: number,
    page: number,
    pageSize: number,
}

export const useListBattle = (params: UseListBattleParams) => {
    return useQuery({
        queryKey: ["list-battle", {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        }],
        queryFn: async (): Promise<ListBattleResponse> => {
            const queryString = new URLSearchParams({
                page: params.page?.toString() || "1",
                pageSize: params.pageSize?.toString() || "10",
                search: params.search || "",
            });
            const response: { data: ListBattleResponse } = await api.get(`/battle/rooms?${queryString.toString()}`).request;
            return response.data;
        },
        staleTime: 0,
        enabled: params.enabled ?? true,
        refetchInterval: 30000,
        refetchOnMount: true,
        refetchOnWindowFocus: false
    });
};

