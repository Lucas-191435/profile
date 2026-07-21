
import { useChatContext } from "@/context/ChatContext";
import { IMessageSender } from "@/types/IChat";
import { Delete, XCircle } from "lucide-react";
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

    return (
        <div className={`flex flex-col gap-0.5 px-2 py-2  ${isOwn ? "items-end" : "items-start"}`}>
            {!isOwn && (
                <span className="text-xs text-muted-foreground font-medium px-1">
                    {sender.name}
                </span>
            )}
            <div
                className={`relative min-w-20 max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    isOwn
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-secondary text-secondary-foreground rounded-tl-none"
                }`}
            >
                {isOwn && (
                    <button
                        className="cursor-pointer w-full h-4 flex justify-end items-center relative"
                        onClick={() => deleteMessage(messageId)}
                    >
                        <XCircle className="w-4 h-4 " />
                    </button>
                )}
                <p className="break-words">{message}</p>
                <span className="block text-right text-[14px] mt-0.5 opacity-70">
                    {formattedTime}
                </span>
            </div>
        </div>
    );
};

export default ChatMessage;
