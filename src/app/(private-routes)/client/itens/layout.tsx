'use client';
import { ItemProvider } from "@/context/ItemContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ItemProvider>{children}</ItemProvider>
    )
}