import { Badge } from "@/components/ui/badge";
import { IPokemonComplete } from "@/types/IPokemon";
import { Ruler, Weight } from "lucide-react";
import Image from "next/image";

const typeColors: Record<string, string> = {
    fire: "bg-fire", water: "bg-water", grass: "bg-grass", electric: "bg-electric",
    normal: "bg-muted-foreground", poison: "bg-purple-500", ground: "bg-amber-700",
    fairy: "bg-pink-400", bug: "bg-lime-500", psychic: "bg-pink-500",
    flying: "bg-sky-400", fighting: "bg-orange-700", rock: "bg-amber-800",
    ghost: "bg-purple-700", ice: "bg-cyan-300", dragon: "bg-indigo-600",
    dark: "bg-zinc-700", steel: "bg-zinc-400",
};
const Description = ({ pokemon }: { pokemon: IPokemonComplete }) => {
    const mainSprite = pokemon.sprites[0]?.url || pokemon.img1;


    function formatDescription(text: string): string {
        return text
            .replace(/\\n/g, '\n') // Substitui \n por uma nova linha real
            .replace(/\\f/g, ' ') // Substitui \f por espaço
            .replace(/\s+/g, ' ') // Normaliza espaços múltiplos
            .trim(); // Remove espaços no início e fim
    }

    return (
        <section className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative glow-red rounded-2xl bg-card border border-border p-6 flex-shrink-0">
                <Image
                    src={mainSprite}
                    alt={`Imagem de ${pokemon.name}`} // Melhor descrição para acessibilidade
                    width={224} // Define largura explícita (56 * 4 = 224px)
                    height={224} // Define altura explícita (56 * 4 = 224px)
                    className="w-48 h-48 md:w-56 md:h-56 object-contain animate-float drop-shadow-2xl rounded-lg"
                />
            </div>
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-display text-sm">#{pokemon.number}</span>
                    <h1 className="font-display text-3xl lg:text-4xl font-black tracking-wider capitalize text-glow">
                        {pokemon.name}
                    </h1>
                </div>
                <div className="flex gap-2">
                    {pokemon.types.map((type) => (
                        <span key={type} className={`text-xs font-semibold uppercase px-3 py-1 rounded-full text-foreground ${typeColors[type] || "bg-muted"}`}>
                            {type}
                        </span>
                    ))}
                </div>
                <p className="font-body text-muted-foreground leading-relaxed text-lg">
                    {formatDescription(pokemon.descriptions[5]?.description || "")}
                </p>
                <div className="flex flex-wrap gap-6 font-body text-sm">
                    <div className="flex items-center gap-2"><Ruler className="h-4 w-4 text-accent" /> <span className="text-muted-foreground">Altura:</span> <span className="font-semibold">{pokemon.height}</span></div>
                    <div className="flex items-center gap-2"><Weight className="h-4 w-4 text-accent" /> <span className="text-muted-foreground">Peso:</span> <span className="font-semibold">{pokemon.weight}</span></div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((a) => (
                        <Badge key={a} variant="secondary" className="font-body">{a}</Badge>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Description;