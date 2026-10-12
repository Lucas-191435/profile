import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PokemonFilters, usePokemonContext } from "@/context/PokemonContext";
import typeColors from "@/utils/typesColors";
import { cn } from "@/lib/utils";

const POKEMON_TYPES = Object.keys(typeColors);

const REGIONS = [
  { value: "KANTO", label: "Kanto", gen: 1 },
  { value: "JOHTO", label: "Johto", gen: 2 },
  { value: "HOENN", label: "Hoenn", gen: 3 },
  { value: "SINNOH", label: "Sinnoh", gen: 4 },
  { value: "UNOVA", label: "Unova", gen: 5 },
];

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const ModalFilters = () => {
  const { filters, activeFiltersCount, applyFilters, clearFilters } = usePokemonContext();
  const [open, setOpen] = useState(false);
  // Rascunho local: só vai para o contexto ao clicar em "Aplicar"
  const [draft, setDraft] = useState<PokemonFilters>(filters);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(filters);
    setOpen(next);
  };

  const handleApply = () => {
    applyFilters(draft);
    setOpen(false);
  };

  const handleClear = () => {
    setDraft({ types: [], regions: [] });
    clearFilters();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="shrink-0 gap-2" aria-label="Filtros">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-4 text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>Selecione tipos e regiões para refinar a Pokédex.</DialogDescription>
        </DialogHeader>

        <section className="space-y-2">
          <h4 className="text-sm font-semibold">Tipos</h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {POKEMON_TYPES.map((type) => {
              const selected = draft.types.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setDraft((d) => ({ ...d, types: toggle(d.types, type) }))}
                  className={cn(
                    "rounded-full px-2 py-1 text-[11px] font-semibold uppercase text-white transition",
                    typeColors[type],
                    selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-40 hover:opacity-80"
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="text-sm font-semibold">Região</h4>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((region) => {
              const selected = draft.regions.includes(region.value);
              return (
                <Button
                  key={region.value}
                  type="button"
                  size="sm"
                  variant={selected ? "default" : "outline"}
                  aria-pressed={selected}
                  onClick={() => setDraft((d) => ({ ...d, regions: toggle(d.regions, region.value) }))}
                >
                  {region.label} (Gen {region.gen})
                </Button>
              );
            })}
          </div>
        </section>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>Limpar</Button>
          <Button onClick={handleApply}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalFilters;
