'use client';
import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { useChatContext } from "@/context/ChatContext";

const ChatContent = () => {
    const {
        messages,
        isLoadingMessages,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        currentUserId,
    } = useChatContext();

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef(0);

    // Rola para o fim ao receber novas mensagens
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    // Salva a altura antes de buscar página anterior
    useEffect(() => {
        if (isFetchingNextPage && scrollContainerRef.current) {
            prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
        }
    }, [isFetchingNextPage]);

    // Restaura a posição de scroll após carregar mensagens antigas
    useEffect(() => {
        if (!isFetchingNextPage && prevScrollHeightRef.current > 0 && scrollContainerRef.current) {
            const diff = scrollContainerRef.current.scrollHeight - prevScrollHeightRef.current;
            scrollContainerRef.current.scrollTop = diff;
            prevScrollHeightRef.current = 0;
        }
    }, [isFetchingNextPage]);

    // Intersection Observer: carrega mais ao chegar no topo
    useEffect(() => {
        const sentinel = topSentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoadingMessages) {
        return (
            <div className="border-2 w-full h-full max-h-[80%] rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm animate-pulse">Carregando mensagens...</p>
            </div>
        );
    }

    return (
        <div
            ref={scrollContainerRef}
            className="border-2 w-full h-full max-h-[80%] rounded-lg overflow-y-auto scrollbar-premium flex flex-col"
        >
            <div ref={topSentinelRef} className="h-1 shrink-0" />

            {isFetchingNextPage && (
                <p className="text-center text-xs text-muted-foreground py-2 animate-pulse">
                    Carregando mais mensagens...
                </p>
            )}

            {messages.length === 0 && (
                <p className="m-auto text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
            )}

            {messages.map((mensagem) => (
                <ChatMessage
                    key={mensagem.id}
                    message={mensagem.text}
                    sender={mensagem.user}
                    timestamp={mensagem.createdAt}
                    isOwn={mensagem.user.id === currentUserId}
                />
            ))}

            <div ref={bottomRef} className="h-1 shrink-0" />
        </div>
    );
};

export default ChatContent;
