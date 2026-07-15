import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { IMessagesPage, IChatRoom } from "@/types/IChat";

export const useMessages = ({ chatId, enabled = true }: { chatId: string; enabled?: boolean }) => {
    return useInfiniteQuery({
        queryKey: ["messages", chatId],
        queryFn: async ({ pageParam }: { pageParam: string | null }) => {
            const params = new URLSearchParams({ limit: "20" });
            if (pageParam) params.set("cursor", pageParam);

            const response: { data: IMessagesPage } = await api.get(`/chat/messages/${chatId}?${params}`).request;
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialPageParam: null as string | null,
        enabled,
    });
};

// Busca as salas do usuário para obter o ID da sala global
// Endpoint esperado: GET /chat/rooms — ajuste se necessário
export const useGlobalRoom = ({ enabled = true }: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: ["global-room"],
        queryFn: async (): Promise<IChatRoom> => {
            const response: { data: IChatRoom[] } = await api.get("/chat/rooms").request;
            if (!response.data || response.data.length === 0) {
                throw new Error("Nenhuma sala de chat encontrada.");
            }
            return response.data[0];
        },
        enabled,
    });
};