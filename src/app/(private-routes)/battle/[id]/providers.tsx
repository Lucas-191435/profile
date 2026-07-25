'use client';

import { MyPokemonProvider } from "@/context/MyPokemonContext"

export function Providers({ children }: { children: React.ReactNode }) {
    return <MyPokemonProvider>
        {children}
    </MyPokemonProvider>
}

