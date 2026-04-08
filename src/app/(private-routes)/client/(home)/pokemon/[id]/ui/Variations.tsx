import { cn } from "@/lib/utils";
import { IPokemonComplete } from "@/types/IPokemon";
import Image from "next/image";

const Variations = ({ pokemon }: { pokemon: IPokemonComplete }) => {
    return (
        <section>
            <h2 className="font-display text-xl font-bold tracking-wide mb-4">Variações de Imagem</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {pokemon.sprites.map((s) => (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-1 flex flex-col justify-between items-center gap-2">
                        <div className="h-[1px]"/>
                        <div className={cn("relative", s.label === "official" ? "w-28 h-28" : "w-32 h-32 sm:w-32 sm:h-32")}>
                            <Image
                                src={s.url}
                                alt={s.label}
                                fill
                                className="object-contain"
                                sizes="90px" // Define o tamanho da imagem
                            />
                        </div>
                        <span className="font-body text-xs text-muted-foreground">{s.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Variations;