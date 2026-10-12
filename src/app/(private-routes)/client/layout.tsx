import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Chat } from "@/components/chat";

import { Sidebar } from "@/components/sidebar/sidebar-client";
import { TourProvider } from "@/components/tour/TourProvider";
import { SoundProvider } from "@/context/SoundContext";
import { ChatCollapseProvider } from "@/hooks/useChatCollapse";
import { SidebarCollapseProvider } from "@/hooks/useSidebarCollapse";
import { nextAuthOptions } from "@/lib/nextAuthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ChatProvider } from "@/context/ChatContext";

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    // <main>
    <SidebarCollapseProvider>
      <ChatCollapseProvider>
        <ChatProvider>

        <TourProvider>
        <SoundProvider>
          <Sidebar />
          <ContentWrapper >
            {children}
          </ContentWrapper>
          <Chat />
        </SoundProvider>
        </TourProvider>
        </ChatProvider>
      </ChatCollapseProvider>
    </SidebarCollapseProvider>
    // </main>
  );
}

export default ClientLayout;