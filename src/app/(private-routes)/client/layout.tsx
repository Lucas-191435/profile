import { ContentWrapper } from "@/components/layout/ContentWrapper";

import {Sidebar} from "@/components/sidebar/sidebar-client";
import { SoundProvider } from "@/context/SoundContext";
import { SidebarCollapseProvider } from "@/hooks/useSidebarCollapse";
import { nextAuthOptions } from "@/lib/nextAuthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/login");
  }
  
  return (
    // <main>
        <SidebarCollapseProvider>
          <SoundProvider>
        <Sidebar />
          <ContentWrapper>
          {children}
        </ContentWrapper>
        </SoundProvider>
        </SidebarCollapseProvider>
      // </main>
  );
}

export default ClientLayout;