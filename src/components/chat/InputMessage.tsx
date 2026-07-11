import { Search, MessagesSquare, Smile, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const InputMessage = () => {

    return (
        <div className={cn("relative flex-1 max-w-md flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground ",
            "focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1"
        )}>
            <Button className="cursor-pointer bg-transparent hover:bg-transparent">
                <Smile className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </Button>
            <Input
                placeholder="Escreva uma mensagem..."
                className="
                    border-none
                    !bg-secondary
                    !border-border
                    !text-muted-foreground
                    focus-visible:!border-border
                    focus-visible:!ring-0
                    focus-visible:!ring-transparent
                    focus-visible:!outline-none
                "
            />
            <Button className="cursor-pointer bg-transparent hover:bg-transparent">
                <Send className="h-4 w-4 text-muted-foreground" />
            </Button>
        </div>
    )
}

export default InputMessage