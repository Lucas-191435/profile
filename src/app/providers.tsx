"use client";

import { ReactNode, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export interface ProvidersProps {
  children: ReactNode;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() =>
    typeof window === "undefined"
      ? makeQueryClient()
      : (browserQueryClient ??= makeQueryClient()),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <SessionProvider
        refetchInterval={30 * 60}
        refetchOnWindowFocus={false}
        session={undefined}
      >
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
