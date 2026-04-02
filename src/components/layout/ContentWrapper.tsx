"use client";

import { cn } from "@/lib/utils";
// import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { sounds } from "@/utils/sounds";
import ControlSound from "./ControlSound";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  // const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarCollapse();

  // if (isMobile) {
  //   return <>{children}</>;
  // }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-spring ",
        isCollapsed ? "md:ml-20 md:w-[calc(100%-5rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]"
      )}
    >
      <div className="min-h-[81px] border-b border-sidebar-border flex items-center justify-end px-4">
        <ControlSound />
      </div>
      <div className="w-full  mx-auto p-4">{children}</div>
    </div>
  );
}
