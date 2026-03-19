import { IPokemonComplete } from "@/types/IPokemon";
import Image from "next/image";

const Variations = ({ pokemon }: { pokemon: IPokemonComplete }) => {
    return (
        <section>
            <h2 className="font-display text-xl font-bold tracking-wide mb-4">Variações de Imagem</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {pokemon.sprites.map((s) => (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2">
                        <div className="relative w-24 h-24">
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