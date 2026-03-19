import { Progress } from "@/components/ui/progress";
import { IPokemonComplete } from "@/types/IPokemon"

const Status = ({pokemon}: {pokemon: IPokemonComplete}) => {
    const maxStat = 255;
    return (
         <section>
        <h2 className="font-display text-xl font-bold tracking-wide mb-4">Status Base</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {pokemon.stats.map((s) => (
            <div key={s.name} className="flex items-center gap-3 font-body">
              <span className="w-16 text-xs text-muted-foreground font-semibold uppercase">{s.name}</span>
              <span className="w-8 text-right font-bold text-sm">{s.value}</span>
              <Progress value={(s.value / maxStat) * 100} className="flex-1 h-2.5 bg-secondary [&>div]:bg-primary" />
            </div>
          ))}
        </div>
      </section>
    );
}

export default Status;