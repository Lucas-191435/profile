'use client';
import { Smile, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { useState, KeyboardEvent, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";

const MAX_LENGTH = 255;
const COUNTER_THRESHOLD = 50;

const EMOJIS = [
    "😀", "😂", "😍", "🥰", "😎", "🤔", "😢", "😡", "🤣", "😊",
    "👍", "👎", "❤️", "🔥", "🎉", "🙏", "💪", "👀", "🤝", "✨",
    "😅", "🤦", "🙄", "😏", "😴", "🤯", "🥳", "😤", "🤗", "😇",
    "🐶", "🐱", "🍕", "🍺", "⚽", "🎮", "🚀", "💡", "📱", "🎵",
];

const InputMessage = () => {
    const [text, setText] = useState("");
    const { sendMessage, isSending } = useChatContext();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (!text.trim() || isSending) return;
        sendMessage(text.trim());
        setText("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length > MAX_LENGTH) return;
        setText(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const insertEmoji = (emoji: string) => {
        const textarea = textareaRef.current;
        const start = textarea?.selectionStart ?? text.length;
        const end = textarea?.selectionEnd ?? text.length;
        const newText = text.slice(0, start) + emoji + text.slice(end);
        if (newText.length > MAX_LENGTH) return;
        setText(newText);
        requestAnimationFrame(() => {
            textarea?.setSelectionRange(start + emoji.length, start + emoji.length);
            textarea?.focus();
        });
    };

    const remaining = MAX_LENGTH - text.length;
    const showCounter = remaining <= COUNTER_THRESHOLD;

    return (
        <div
            className={cn(
                "relative flex-1 max-w-md flex items-end gap-2 rounded-lg border border-border bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground",
                "focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1",
            )}
        >
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 mb-1" type="button">
                        <Smile className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start" side="top">
                    <div className="grid grid-cols-8 gap-1">
                        {EMOJIS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => insertEmoji(emoji)}
                                className="text-lg hover:bg-accent rounded p-0.5 transition-colors leading-none"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            <div className="flex-1 relative w-1">
                <Textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escreva uma mensagem..."
                    className="min-h-0 max-h-32 border-none resize-none w-full overflow-x-hidden overflow-y-auto [field-sizing:normal] !bg-secondary !border-border !text-muted-foreground
                        focus-visible:!border-border focus-visible:!ring-0
                        focus-visible:!ring-transparent focus-visible:!outline-none py-2"
                />
                {showCounter && (
                    <span
                        className={cn(
                            "absolute bottom-1 right-1 text-xs pointer-events-none",
                            remaining <= 10 ? "text-destructive" : "text-muted-foreground/60",
                        )}
                    >
                        {remaining}
                    </span>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 mb-1"
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
