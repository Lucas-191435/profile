import { ContentWrapper } from "@/components/layout/ContentWrapper";

import Sidebar from "@/components/sidebar";
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
    <div>
      <h1>Client Layout</h1>
      <div className="flex-row w-full" style={{borderWidth: 1, borderColor: 'red'}}>
        <SidebarCollapseProvider>
        <Sidebar />
          <ContentWrapper>
          {children}
        </ContentWrapper>
        </SidebarCollapseProvider>
      </div>
    </div>
  );
}

export default ClientLayout;