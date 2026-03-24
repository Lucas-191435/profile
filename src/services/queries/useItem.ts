import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { IGetItems } from "../dto/IUseItem";


type UseGetItemParams = {
    page?: number;
    pageSize?: number;
    query?: string;
    categoryId?: number;
};
export const useGetItems = (params: UseGetItemParams) => {
    return useQuery({
        queryKey: ["get-items", {
            page: params.page,
            pageSize: params.pageSize,
            query: params.query,
            categoryId: params.categoryId
        }],
        queryFn: async (): Promise<IGetItems> => {
            const queryString = new URLSearchParams({
                page: params.page?.toString() || "1",
                pageSize: params.pageSize?.toString() || "50",
                query: params.query || "",
                categoryId: params.categoryId?.toString() || ""
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

