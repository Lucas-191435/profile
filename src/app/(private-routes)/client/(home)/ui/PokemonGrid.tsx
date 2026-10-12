import { usePokemonContext } from "@/context/PokemonContext";
import PokemonCard from "./PokemonCard";
import SkeletonCard from "../components/SkeletonCard";
import { Button } from "@/components/ui/button";

const PokemonGrid = () => {
    const { pokemons, isLoading, clearAll } = usePokemonContext();
    if (isLoading) {
        return (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 min-h-[1300px]">
                {Array.from({ length: 24 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }
    if (pokemons && pokemons.pokemon.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <p className="text-muted-foreground">Nenhum Pokémon encontrado.</p>
                <Button variant="outline" onClick={clearAll}>Limpar filtros</Button>
            </div>
        );
    }
    return (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 min-h-[1200px]" data-tour="home-grid">
            {pokemons?.pokemon.map(( pokemon ) => (
                <PokemonCard key={pokemon.number} pokemon={pokemon} />
            ))}
        </div>
    );
}

export default PokemonGrid;