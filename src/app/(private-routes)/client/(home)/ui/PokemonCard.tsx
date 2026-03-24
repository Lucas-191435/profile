import { IPokemon } from "@/types/IPokemon";
import Image from "next/image";
import Link from "next/link";


interface PokemonCardProps {
    pokemon: IPokemon;
}

const typeColors: Record<string, string> = {
    fire: "bg-fire", water: "bg-water", grass: "bg-grass", electric: "bg-electric",
    normal: "bg-muted-foreground", poison: "bg-purple-500", ground: "bg-amber-700",
    fairy: "bg-pink-400", bug: "bg-lime-500", psychic: "bg-pink-500",
    flying: "bg-sky-400", fighting: "bg-orange-700", rock: "bg-amber-800",
    ghost: "bg-purple-700", ice: "bg-cyan-300", dragon: "bg-indigo-600",
    dark: "bg-zinc-700", steel: "bg-zinc-400",
};

const PokemonCard = ({ pokemon }: PokemonCardProps) => {

    return (
        <Link href={`/client/pokemon/${pokemon.number}`} className="block">
            <div className="card-pokemon group cursor-pointer ">
                <div className="flex flex-row sm:flex-col md:flex-row gap-1 justify-between items-start mb-2">
                    <span className="text-muted-foreground font-display text-xs font-semibold">#{pokemon.number.toString().padStart(3, "0")}</span>
                    <div className="flex gap-1">
                        {pokemon.types.map((type) => (
                            <span key={type} className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full text-foreground ${typeColors[type] || "bg-muted"}`}>
                                {type}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center items-center py-4 h-48 sm:h-40 md:h-44 lg:h-48 overflow-hidden">
                    <Image
                        src={pokemon.img3}
                        alt={`Imagem de ${pokemon.name}`}
                        width={200}
                        height={200}
                        priority
                         className="w-auto h-full max-w-full max-h-full min-w-[120px] min-h-[120px] object-contain group-hover:animate-float transition-transform duration-500 drop-shadow-lg opacity-0 scale-95"
                        onLoadingComplete={(img) => img.classList.add("opacity-100", "scale-100")}
                    />
                </div>
                <h3 className="text-center font-display text-sm font-semibold capitalize tracking-wide">{pokemon.name}</h3>
            </div>
        </Link>
    )
}

export default PokemonCard;