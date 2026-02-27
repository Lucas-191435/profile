import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerSidebarProps {
  children: ReactNode;
  className?: string;
}

export default function ContainerSidebar({
  children,
  className,
}: ContainerSidebarProps) {
  return (
    <div className={cn("px-4 pb-8 pt-4 md:px-4 md:pt-4", className)}>
      {children}
    </div>
  );
}
