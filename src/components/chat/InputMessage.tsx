'use client';
import { Smile, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState, KeyboardEvent } from "react";
import { useChatContext } from "@/context/ChatContext";

const InputMessage = () => {
    const [text, setText] = useState("");
    const { sendMessage, isSending } = useChatContext();

    const handleSend = () => {
        if (!text.trim() || isSending) return;
        sendMessage(text.trim());
        setText("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            className={cn(
                "relative flex-1 max-w-md flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground",
                "focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1",
            )}
        >
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" type="button">
                <Smile className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva uma mensagem..."
                className="border-none !bg-secondary !border-border !text-muted-foreground
                    focus-visible:!border-border focus-visible:!ring-0
                    focus-visible:!ring-transparent focus-visible:!outline-none"
            />
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                type="button"
                onClick={handleSend}
                disabled={!text.trim() || isSending}
            >
                <Send className="h-4 w-4 text-muted-foreground" />
            </Button>
        </div>
    );
};

export default InputMessage;
