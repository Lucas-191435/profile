import { ContentWrapper } from "@/components/layout/ContentWrapper";

import {Sidebar} from "@/components/sidebar/sidebar-client";
import { SidebarCollapseProvider } from "@/hooks/useSidebarCollapse";
import { nextAuthOptions } from "@/lib/nextAuthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(nextAuthOptions);
  console.log("Session in ClientLayout:", session);
  if (!session) {
    redirect("/login");
  }
  
  return (
    // <main>
        <SidebarCollapseProvider>
        <Sidebar />
          <ContentWrapper>
          {children}
        </ContentWrapper>
        </SidebarCollapseProvider>
      // </main>
  );
}

export default ClientLayout;