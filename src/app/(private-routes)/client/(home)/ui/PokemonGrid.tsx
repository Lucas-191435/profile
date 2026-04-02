import { usePokemonContext } from "@/context/PokemonContext";
import PokemonCard from "./PokemonCard";
import SkeletonCard from "../components/SkeletonCard";

const PokemonGrid = () => {
    const { pokemons, isLoading } = usePokemonContext();
    if (isLoading) {
        return (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 min-h-[1200px]">
                {Array.from({ length: 24 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }
    return (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 min-h-[1200px]">
            {pokemons?.pokemon.map(( pokemon ) => (
                <PokemonCard key={pokemon.number} pokemon={pokemon} />
            ))}
        </div>
    );
}

export default PokemonGrid;