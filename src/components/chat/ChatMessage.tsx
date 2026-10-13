
import { useChatContext } from "@/context/ChatContext";
import { IMessageSender } from "@/types/IChat";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TRAINERS } from "@/utils/trainers";
import { getChatColor } from "@/utils/chatColors";
import { cn } from "@/lib/utils";
type ChatMessageProps = {
    messageId: string;
    message: string;
    sender: IMessageSender;
    timestamp: string;
    isOwn: boolean;
};

const ChatMessage = ({ messageId, message, sender, timestamp, isOwn }: ChatMessageProps) => {
    const {
            deleteMessage,
        } = useChatContext();
    const formattedTime = new Date(timestamp).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const trainer = TRAINERS.find((t) => t.id === sender.avatar) ?? TRAINERS[0];
    const color = getChatColor(sender.id);

    return (
        <div className={cn("group flex gap-2 px-2 py-2", isOwn ? "flex-row-reverse" : "flex-row")}>
            <Avatar
                className={cn(
                    "w-9 h-9 shrink-0 bg-background ring-2",
                    isOwn ? "ring-primary/70" : color.ring,
                )}
            >
                <AvatarImage src={trainer.url} alt={sender.name} className="object-contain" />
                <AvatarFallback className="font-display text-xs">{sender.name?.[0]}</AvatarFallback>
            </Avatar>

            <div className={cn("flex flex-col gap-0.5 min-w-0 max-w-[80%]", isOwn ? "items-end" : "items-start")}>
                <span className={cn("text-xs font-semibold px-1", isOwn ? "text-primary" : color.name)}>
                    {isOwn ? "Você" : sender.name}
                </span>

                <div className={cn("flex items-center gap-1", isOwn && "flex-row-reverse")}>
                    <div
                        className={cn(
                            "min-w-16 max-w-full rounded-2xl px-3 py-2 text-sm",
                            isOwn
                                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-tr-sm shadow-md shadow-primary/20"
                                : cn("border text-foreground rounded-tl-sm", color.bubble),
                        )}
                    >
                        <p className="break-words whitespace-pre-wrap">{message}</p>
                        <span className="block text-right text-[10px] mt-1 opacity-70">
                            {formattedTime}
                        </span>
                    </div>

                    {isOwn && (
                        <button
                            className="shrink-0 rounded-full p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                            onClick={() => deleteMessage(messageId)}
                            aria-label="Apagar mensagem"
                            title="Apagar mensagem"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
