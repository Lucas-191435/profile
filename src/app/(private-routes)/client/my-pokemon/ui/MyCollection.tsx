import { useMyPokemonContext } from "@/context/MyPokemonContext";
import { useState } from "react";

const MyCollection = () => {
    const { pokemons, isLoading: contextLoading, error: contextError, myCollection, setMyCollection } = useMyPokemonContext();
    const myPokemon = pokemons || [];


    const toggleCollection = (id: string) => {
        setMyCollection((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };
    return (
        <section>
            <h2 className="font-display text-lg font-semibold mb-3 text-muted-foreground">Minha Coleção</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {myPokemon.map((p) => {
                    const owned = myCollection.includes(p.id);
                    return (
                        <button
                            key={p.id}
                            onClick={() => toggleCollection(p.id)}
                            className={`relative rounded-lg border p-1 transition-all hover:scale-105 ${owned
                                ? "border-primary/50 bg-card"
                                : "border-border/30 bg-card/30 opacity-40 grayscale"
                                }`}
                        >
                            <img src={p.pokemon.img1} alt={p.pokemon.name} className="w-full aspect-square object-contain" />
                            <span className="block text-[10px] font-body text-center truncate">{p.nickname || p.pokemon.name}</span>
                            {owned && (
                                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    )
}

export default MyCollection;