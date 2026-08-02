import { Backpack } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BagModal({ open, onOpenChange }: BagModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">Mochila</DialogTitle>
          <DialogDescription>Itens de batalha ainda não estão disponíveis.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Backpack className="w-10 h-10 text-muted-foreground" />
          <p className="font-display text-sm tracking-widest text-muted-foreground">EM BREVE</p>
          <p className="font-body text-xs text-muted-foreground max-w-xs">
            Poções, revives e curas de status ainda não são suportados pela batalha em tempo real.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
