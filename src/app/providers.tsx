"use client";

import { ReactNode, useState } from "react";
import { SessionProvider } from "next-auth/react";


export interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
        <SessionProvider
          refetchInterval={30 * 60}
          refetchOnWindowFocus={false}
          session={undefined}
        >
            {children}
        </SessionProvider>
  );
}
