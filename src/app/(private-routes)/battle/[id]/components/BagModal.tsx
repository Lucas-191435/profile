import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { STATUS_ITEMS, POKEMON_ITEMS } from "./constants";
import { ModalView } from "./types";

interface BagModalProps {
  modal: ModalView;
  onOpenChange: (open: boolean) => void;
  onOpenBagView: (view: ModalView) => void;
  onUseItem: (text: string) => void;
}

export function BagModal({ modal, onOpenChange, onOpenBagView, onUseItem }: BagModalProps) {
  return (
    <>
      {/* BAG - main */}
      <Dialog open={modal === "bag"} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">Mochila</DialogTitle>
            <DialogDescription>Selecione uma categoria de itens.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => onOpenBagView("bag-status")}
              className="border-2 border-border/50 hover:border-primary rounded-lg p-4 font-display tracking-wider text-left flex items-center gap-3"
            >
              <span className="text-2xl">💊</span>
              <div>
                <div className="text-sm font-bold">ITENS DE STATUS</div>
                <div className="text-[10px] font-body text-muted-foreground normal-case tracking-normal">
                  Remédios para problemas de status
                </div>
              </div>
            </button>
            <button
              onClick={() => onOpenBagView("bag-pokemon")}
              className="border-2 border-border/50 hover:border-primary rounded-lg p-4 font-display tracking-wider text-left flex items-center gap-3"
            >
              <span className="text-2xl">🧪</span>
              <div>
                <div className="text-sm font-bold">ITENS PRO POKÉMON</div>
                <div className="text-[10px] font-body text-muted-foreground normal-case tracking-normal">
                  Poções, revives e curas de HP
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BAG - status items */}
      <Dialog open={modal === "bag-status"} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">Itens de Status</DialogTitle>
            <DialogDescription>Use para curar problemas de status.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {STATUS_ITEMS.map((item) => (
              <button
                key={item.name}
                onClick={() => onUseItem(`Você usou ${item.name}!`)}
                className="w-full text-left border border-border/50 hover:border-primary rounded-lg p-3"
              >
                <div className="font-display text-sm font-bold">{item.name}</div>
                <div className="font-body text-xs text-muted-foreground">{item.effect}</div>
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => onOpenBagView("bag")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        </DialogContent>
      </Dialog>

      {/* BAG - pokemon items */}
      <Dialog open={modal === "bag-pokemon"} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">Itens pro Pokémon</DialogTitle>
            <DialogDescription>Restaure HP ou reanime seus Pokémon.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {POKEMON_ITEMS.map((item) => (
              <button
                key={item.name}
                onClick={() => onUseItem(`Você usou ${item.name}!`)}
                className="w-full text-left border border-border/50 hover:border-primary rounded-lg p-3"
              >
                <div className="font-display text-sm font-bold">{item.name}</div>
                <div className="font-body text-xs text-muted-foreground">{item.effect}</div>
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => onOpenBagView("bag")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
