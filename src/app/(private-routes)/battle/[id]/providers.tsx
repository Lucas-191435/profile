'use client';

import { BattleProvider } from "@/context/BattleContext"
import { BattleSoundProvider } from "@/context/BattleSoundContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return <BattleSoundProvider>
        <BattleProvider>
            {children}
        </BattleProvider>
    </BattleSoundProvider>
}

