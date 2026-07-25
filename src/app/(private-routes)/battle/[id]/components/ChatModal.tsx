import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const QUICK_MESSAGES = ["Boa sorte!", "Foi ótimo batalhar!", "Preparado?", "Vamos nessa!"];

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (message: string) => void;
}

export function ChatModal({ open, onOpenChange, onSend }: ChatModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">Chat</DialogTitle>
          <DialogDescription>Envie uma mensagem ao adversário.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {QUICK_MESSAGES.map((msg) => (
            <button
              key={msg}
              onClick={() => onSend(msg)}
              className="w-full text-left border border-border/50 hover:border-primary rounded-lg p-3 font-body text-sm"
            >
              {msg}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
