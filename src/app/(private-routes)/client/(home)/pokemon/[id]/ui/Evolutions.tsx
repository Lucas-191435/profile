import { IPokemonComplete } from "@/types/IPokemon";
import Link from "next/link";

const Evolutions = ({pokemon}: {pokemon: IPokemonComplete}) => {
    return (
       <section>
        <h2 className="font-display text-xl font-bold tracking-wide mb-4">Evoluções</h2>
        <div className="flex flex-wrap items-center gap-4">
          {pokemon.evolutionChain.map((evo, idx) => {
            const evoSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`;

            const isCurrent = evo.id === pokemon.number;

            const card = (
              <div
                className={`card-pokemon flex flex-col items-center gap-2 min-w-[120px] ${isCurrent ? "border-primary glow-red cursor-pointer" : ""}`}
              >
                <img src={evoSprite} alt={evo.name} className="w-16 h-16 object-contain" loading="lazy" />
                <span className="font-display text-sm font-semibold capitalize">{evo.name}</span>
                {evo.level && <span className="font-body text-xs text-muted-foreground">Nível {evo.level}</span>}
              </div>
            );

            return (
              <div key={evo.id} className="flex items-center gap-2">
                {idx > 0 && <span className="text-muted-foreground font-display text-lg">→</span>}
                  <Link href={`/client/pokemon/${evo.id}`}>{card}</Link>
                
              </div>
            );
          })}
        </div>
      </section>
    );
}

export default Evolutions;