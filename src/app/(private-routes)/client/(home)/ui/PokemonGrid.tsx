import { usePokemonContext } from "@/context/PokemonContext";
import PokemonCard from "./PokemonCard";

const PokemonGrid = () => {
    const { pokemons, isLoading } = usePokemonContext();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    console.log(pokemons);
    return (
        <div className="grid grid-cols-4">
            {pokemons?.pokemon.map((pokemon: any) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
        </div>
    );
}

export default PokemonGrid;