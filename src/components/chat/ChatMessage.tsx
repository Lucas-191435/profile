
type ChatMessageProps = {
    message: string;
    sender: "user" | "bot";
    timestamp: string;
    userIdLoggedIn: string;
};

const ChatMessage = ({ message, sender, timestamp }: ChatMessageProps) => {
    return (
        <div className={`
        border-2 w-full rounded-lg h-10 my-2 flex flex-col items-start justify-start
        `}>

        </div>
    )
    // return (
    //     <div className={`flex flex-col p-2 rounded-lg max-w-xs ${sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}>
    //         <h2>{sender}</h2>
    //         <p>{message}</p>
    //         <span>{timestamp}</span>
    //     </div>
    // )
}

export default ChatMessage;