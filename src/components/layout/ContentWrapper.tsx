"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-spring",
        "md:ml-64 md:w-[calc(100%-16rem)]", // Corresponds to w-64 sidebar
      )}
    >
      {children}
    </div>
  );
}
