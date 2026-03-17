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
        <Link href={`/pokemon/${pokemon.number}`} className="block">
            <div className="card-pokemon group cursor-pointer ">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-muted-foreground font-display text-xs font-semibold">#{pokemon.number.toString().padStart(3, "0")}</span>
                    <div className="flex gap-1">
                        {pokemon.types.map((type) => (
                            <span key={type} className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full text-foreground ${typeColors[type] || "bg-muted"}`}>
                                {type}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center py-4 relative h-60 sm:h-30 md:w-30 md:h-40 md:w-40 lg:h-50 lg:w-50">
                    <Image
                        src={pokemon.img3}
                        alt={`Imagem de ${pokemon.name}`}
                        layout="fill"
                        objectFit="cover"
                        className=" object-contain group-hover:animate-float transition-transform drop-shadow-lg"
                    />
                </div>
                <h3 className="text-center font-display text-sm font-semibold capitalize tracking-wide">{pokemon.name}</h3>
            </div>
        </Link>
    )
}

export default PokemonCard;