
import { Providers } from "./provider";

export default function MyPokemonLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            {children}
        </Providers>
    )
}