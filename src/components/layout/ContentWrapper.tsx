"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarCollapse();

  if (isMobile) {
    return <>{children}</>;
  }
  console.log("isCollapsed", isCollapsed);
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-spring w-full  mx-auto p-4",
        isCollapsed ? "md:ml-20 md:w-[calc(100%-5rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]"
      )}
    >
      {children}
    </div>
  );
}
