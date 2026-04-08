'use client';
import { PokemonProvider } from "@/context/PokemonContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <PokemonProvider>{children}</PokemonProvider>
    )
}