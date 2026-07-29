'use client';

import { BattleProvider } from "@/context/BattleContext"

export function Providers({ children }: { children: React.ReactNode }) {
    return <BattleProvider>
        {children}
    </BattleProvider>
}

