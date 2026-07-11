'use client';
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatCollapse } from "@/hooks/useChatCollapse";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Suspense } from "react";
import InputMessage from "./InputMessage";
import ChatContent from "./ChatContent";
export function Chat() {
    const { isCollapsed, toggleCollapse } = useSidebarCollapse();
    const { isCollapsed: isChatCollapsed, toggleCollapse: toggleChatCollapse } = useChatCollapse();
    const isMobile = useIsMobile();

    const handleToggleChat = () => {
        const chatWillOpen = !isChatCollapsed;
        toggleChatCollapse();
        // Ao abrir o chat, fecha a sidebar se estiver aberta
        if (chatWillOpen && !isCollapsed) {
            toggleCollapse();
        }
    };


    // Mobile: Sheet drawer
    if (isMobile) {
        return null
    }
    // Desktop: Fixed sidebar
    return (
        isChatCollapsed ? (
            <Suspense fallback={<h1>Loading...</h1>}>
                <aside
                    className={cn(
                        "fixed right-0 top-0 z-40",
                        "flex h-screen flex-col bg-sidebar text-sidebar-foreground",
                        "transition-all duration-300 ease-spring ",
                        "w-84 p-2 flex flex-col gap-2",
                    )}
                    style={{

                    }}
                >
                    <div className="w-full h-[10%]  flex justify-end">
                        <button
                            onClick={handleToggleChat}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground hover:shadow-lg hover:shadow-primary/20",
                                "border-2",
                                isChatCollapsed && " top-6",
                                "hidden md:flex border border-primary/30 cursor-pointer",
                            )}
                        >

                            <ChevronRight className="h-4 w-4 text-primary drop-shadow-sm" />
                        </button>
                    </div>

                    <ChatContent />
                    <div className="border-2 w-full max-h-[10%] rounded-lg p-1 flex items-center justify-center">
                        <InputMessage />
                    </div>
                </aside>
            </Suspense>
        ) : (
            <div className="fixed
            border-2 border-primary rounded-full
            right-5 bottom-20 z-40 flex h-[50px] transition-all duration-300 ease-spring bg-sidebar text-sidebar-foreground w-[50px]">
                <MessageCircle className="m-auto w-6 h-6 text-primary cursor-pointer" onClick={handleToggleChat} />
            </div>
        )
    )
}