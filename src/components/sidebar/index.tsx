'use client';
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";

const Sidebar = () => {
     const isDesktop = useMediaQuery("(min-width: 1024px)", {
    initializeWithValue: false,
  });

    const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  return (
    <div>   
        <div style={{borderWidth: 1, borderColor: 'blue', display: isDesktop ? 'block' : 'none'}}>
            <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col justify-between border-r bg-secondary pb-[28px] pt-[56px] text-secondary-foreground transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20 px-[10px]" : "w-64 px-[25px]",
      )}
    >aa</aside>
        </div>
        <div style={{borderWidth: 1, borderColor: 'green', display: isDesktop ? 'none' : 'block'}}>
            <h1>Mobile Sidebar</h1>
        </div>
    </div>
  );
}

export default Sidebar;