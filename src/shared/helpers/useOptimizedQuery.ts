import {
  useQuery,
  UseQueryOptions,
  QueryKey,
} from '@tanstack/react-query';

/**
 * Helper para abstrair useQuery com configurações otimizadas de cache
 * 
 * Configurações padrão:
 * - staleTime: 2 minutos (dados considerados frescos)
 * - gcTime: 10 minutos (tempo antes de remover do cache)
 * - refetchOnWindowFocus: false (não recarrega ao focar janela)
 * - refetchOnMount: true (recarrega ao montar componente se stale)
 * - retry: 1 (apenas uma tentativa de retry em caso de erro)
 */
export function useOptimizedQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) {
  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    ...options,
  });
}
