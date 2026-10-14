import { useSoundContext } from "@/context/SoundContext";
import { IPokemon } from "@/types/IPokemon";
import { sounds } from "@/utils/sounds";
import Image from "next/image";
import Link from "next/link";
import { Music } from "lucide-react"


interface PokemonCardProps {
    pokemon: IPokemon;
}

const typeColors: Record<string, string> = {
    normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
    grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
    ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
    rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
    steel: "#B7B7CE", fairy: "#D685AD",
};

const getTypeColor = (type: string) => typeColors[type] ?? "#A8A77A";

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
    const { handleSoundChange } = useSoundContext();
    const mainColor = getTypeColor(pokemon.types[0]);
    return (
        <Link href={`/client/pokemon/${pokemon.number}`} onClick={() => handleSoundChange(pokemon.name as any)} className="block">
            <div className="card-pokemon group cursor-hover relative">
                {sounds[pokemon.name as keyof typeof sounds] && (
                    <div className="animate-bounce-custom absolute bottom-2 right-2 bg-red-400 p-1 rounded-[5px]">
                        <Music size={18} />
                    </div>
                )}
                <span className="text-muted-foreground font-display text-xs font-semibold">#{pokemon.number.toString().padStart(3, "0")}</span>
                <div
                    className="flex justify-center items-center py-4 h-48 sm:h-40 md:h-44 lg:h-48 overflow-hidden rounded-lg"
                    style={{ background: `radial-gradient(circle at center, ${mainColor}33 0%, transparent 65%)` }}
                >
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
                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                    {pokemon.types.map((type) => {
                        const color = getTypeColor(type);
                        return (
                            <span
                                key={type}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold capitalize px-2.5 py-0.5 rounded-full border"
                                style={{
                                    backgroundColor: `${color}26`,
                                    borderColor: `${color}66`,
                                    color: `color-mix(in srgb, ${color} 65%, white)`,
                                }}
                            >
                                <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
                                {type}
                            </span>
                        );
                    })}
                </div>
            </div>
        </Link>
    )
}

export default PokemonCard;