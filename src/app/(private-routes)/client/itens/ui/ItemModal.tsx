
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, ItemCategoryColor } from "@/constants/items";
import { IItem } from "@/types/Item";
import { MapPin } from "lucide-react";
import Image from "next/image";
const PropertyTag = ({ label, active }: { label: string; active: boolean }) => (
  <div className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-body border ${
    active
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-secondary/50 text-muted-foreground border-border"
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-muted-foreground/40"}`} />
    {label}
  </div>
);

type ItemModalProps = {
    selectedItem: IItem | null;
    setSelectedItem: (item: IItem | null) => void;
}
const ItemModal = ({ selectedItem, setSelectedItem }: ItemModalProps) => {

    return (
        <Dialog  open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="bg-card border-border  max-h-[85vh] overflow-y-auto scrollbar-premium">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="relative w-1/3 h-16 rounded-xl bg-secondary flex items-center justify-center border border-border">
                  <Image 
                    src={selectedItem.sprite} 
                    alt={selectedItem.name} 
                    width={48} 
                    height={48} 
                    className="pixelated object-contain" 
                  />
                </div>
                <div>
                  <DialogTitle className="font-display text-xl">{selectedItem.name}</DialogTitle>
                  <DialogDescription className="font-body mt-1">{selectedItem.effect}</DialogDescription>
                  <Badge variant="outline" className={`mt-1.5 text-xs border ${ItemCategoryColor[selectedItem.pokeItemPocketId]}`}>
                    {CATEGORIES.find(c => c.key === selectedItem.pokeItemPocketId)?.label}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <Separator className="bg-border" />

            {/* Description */}
            <div>
              <h4 className="font-display text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">Descrição</h4>
              <p className="text-sm font-body text-foreground/90 leading-relaxed">{selectedItem.description}</p>
            </div>

            {/* Properties */}
            <div>
              <h4 className="font-display text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">Propriedades</h4>
              <div className="grid grid-cols-2 gap-2">
                <PropertyTag label="Consumível" active={selectedItem.isConsumable} />
                <PropertyTag label="Held Item" active={selectedItem.isHeldItem} />
                <PropertyTag label="Uso em Pokémon" active={selectedItem.isPokemonUse} />
                <PropertyTag label="Uso em Batalha" active={selectedItem.isBattleUse} />
                <PropertyTag label="Descartável" active={selectedItem.isDiscardable} />
              </div>
            </div>

            {/* Price */}
            {selectedItem.price > 0 && (
              <div>
                <h4 className="font-display text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1.5">Preço</h4>
                <p className="font-body text-sm text-foreground">
                  Compra: <span className="text-accent font-semibold">₽{selectedItem.price.toLocaleString()}</span>
                  {" · "}
                  Venda: <span className="text-muted-foreground">₽{(selectedItem.price / 2).toLocaleString()}</span>
                </p>
              </div>
            )}

            <Separator className="bg-border" />

            {/* Regions */}
            <div>
              <h4 className="font-display text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">Disponível nas Regiões</h4>
              <div className="space-y-2">
                {selectedItem.regions.split(",").map((r, i) => (
                  <div key={i} className="flex items-start gap-2 bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                    <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-display text-xs font-semibold text-foreground">{r}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    )
}

export default ItemModal;