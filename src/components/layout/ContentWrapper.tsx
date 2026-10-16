"use client";

import { cn } from "@/lib/utils";
// import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useChatCollapse } from "@/hooks/useChatCollapse";
import { sounds } from "@/utils/sounds";
import ControlSound from "./ControlSound";
import SocialLinks from "./SocialLinks";
import { File } from "lucide-react";
import Link from "next/link";
import { BattleButton } from "../BattleButton";
import { TourMenu } from "../tour/TourMenu";
export function ContentWrapper({ children }: { children: React.ReactNode }) {
  // const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarCollapse();
  const { isCollapsed: isChatCollapsed } = useChatCollapse();
  // if (isMobile) {
  //   return <>{children}</>;
  // }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-spring",
        isCollapsed ? "md:ml-20" : "md:ml-64",
        isChatCollapsed ? "lg:mr-84" : "",
      )}
       data-tour="welcome"
    >
      {/* Todos os itens com size-10 + shrink-0: sem isso o flex esmagava os ícones no mobile. */}
      <div className="min-h-[81px] border-b border-sidebar-border flex items-center justify-end gap-2 px-4">
        <BattleButton />
        <TourMenu />
        <Link href="/curriculum" rel="noopener noreferrer" className="size-10 shrink-0 flex items-center justify-center border-1 rounded-md cursor-pointer"  data-tour="btn-curriculum">
          <File className="w-6 h-6 text-primary" />
        </Link>
        <SocialLinks />
        <ControlSound />
      </div>
      <div className="w-full mx-auto p-4">{children}</div>
    </div>
  );
}
