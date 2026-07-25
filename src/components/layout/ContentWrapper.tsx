"use client";

import { cn } from "@/lib/utils";
// import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useChatCollapse } from "@/hooks/useChatCollapse";
import { sounds } from "@/utils/sounds";
import ControlSound from "./ControlSound";
import SocialLinks from "./SocialLinks";
import { File, Route } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { BattleButton } from "../BattleButton";
export function ContentWrapper({ children }: { children: React.ReactNode }) {
  // const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarCollapse();
  const { isCollapsed: isChatCollapsed } = useChatCollapse();
  // if (isMobile) {
  //   return <>{children}</>;
  // }

  console.log("isCollapsed", isCollapsed);
  console.log("isChatCollapsed", isChatCollapsed);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-spring",
        isCollapsed ? "md:ml-20" : "md:ml-64",
        isChatCollapsed ? "lg:mr-84" : "",
      )}
       data-tour="welcome"
    >
      <div className="min-h-[81px] border-b border-sidebar-border flex items-center justify-end px-4">
        <BattleButton />
        <Button className="border-1 m-2 p-1 rounded-sm cursor-pointer" onClick={() => window.resetTour() }>
          <Route className="w-6 h-6 text-white" />
        </Button>
        <Link href="/curriculum" rel="noopener noreferrer" className="border-1 m-2 p-1 rounded-sm cursor-pointer"  data-tour="btn-curriculum">
          <File className="w-6 h-6 text-primary" />
        </Link>
        <SocialLinks />
        <ControlSound />
      </div>
      <div className="w-full mx-auto p-4">{children}</div>
    </div>
  );
}
