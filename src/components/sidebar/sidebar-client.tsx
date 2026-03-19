"use client";

import {
  Home,
  Map,
  Heart,
  Calendar,
  Mailbox,
  ChevronRight,
  ChevronLeft,
  Menu,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense, useState } from "react";
import { signOut } from "next-auth/react";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const mainNavItems: NavItem[] = [
  { label: "Home", icon: Home, path: "/client" },
  { label: "Meu Pokémon", icon: Heart, path: "/client/my-pokemon" },
  { label: "Meu Perfil", icon: Calendar, path: "/client/profile" },
  { label: "Itens", icon: Mailbox, path: "/client/itens" },
  { label: "Regiões", icon: Map, path: "/client/regions" },
];


function SidebarContent({
  collapsed,
  setCollapsed,
  onNavClick,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "flex items-center max-h-[81px] border-b border-sidebar-border p-6 bg-gradient-to-r from-sidebar-background to-sidebar-accent/20",
          collapsed ? "justify-center " : "justify-between",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-display font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-sidebar-foreground">PokéDex</h1>
              <p className="text-xs text-sidebar-foreground/60">Explore o mundo</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground hover:shadow-lg hover:shadow-primary/20",
            collapsed && " top-6",
            "hidden md:flex",
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="scrollbar-premium flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-2">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/client" &&
                pathname?.startsWith(`${item.path}/`));

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onNavClick}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 group",
                  "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  "hover:shadow-md hover:shadow-primary/10 hover:border-primary/20",
                  isActive && [
                    "bg-sidebar-accent text-sidebar-foreground shadow-lg shadow-primary/20",
                    "border border-primary/30 font-semibold",
                    "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-50"
                  ],
                  collapsed && "justify-center px-3",
                )}
              >
                {!collapsed && isActive && (
                  <span className={cn(
                    "absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-lg shadow-primary/50",
                    "animate-pulse"
                  )} />
                )}
                
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isActive && "text-primary drop-shadow-sm",
                    "group-hover:scale-110"
                  )}
                />
                
                {!collapsed && (
                  <span className={cn(
                    "flex-1 transition-all duration-300",
                    isActive && "text-sidebar-foreground font-medium"
                  )}>
                    {item.label}
                  </span>
                )}

                {!collapsed && isActive && (
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Seção adicional para elementos temáticos */}
        {!collapsed && (
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-display font-semibold text-primary">Sistema Online</span>
            </div>
            <p className="text-xs text-sidebar-foreground/60">
              Conectado à PokéDex Nacional
            </p>
          </div>
        )}
      </nav>
      
      {/* Botão de Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            "relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 group w-full",
            "text-sidebar-foreground/70 hover:bg-red-500/20 hover:text-red-400",
            "hover:shadow-md hover:shadow-red-500/10 hover:border-red-500/20",
            collapsed && "justify-center px-3",
          )}
        >
          <LogOut
            className={cn(
              "h-5 w-5 flex-shrink-0 transition-all duration-300",
              "group-hover:scale-110 group-hover:text-red-400"
            )}
          />
          
          {!collapsed && (
            <span className="flex-1 transition-all duration-300">
              Sair
            </span>
          )}
        </button>
      </div>
    </>
  )
}


export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  // Mobile: Sheet drawer
    if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 h-10 w-10 rounded-xl bg-sidebar shadow-lg md:hidden"
          >
            <Menu className="h-5 w-5 text-sidebar-foreground" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 border-sidebar-border p-0"
          style={{
            background: "#1e293b", // Tailwind's slate-800
          }}
        >
          <div className="flex h-full flex-col">
            <SidebarContent
              collapsed={false}
              setCollapsed={() => {}}
              onNavClick={() => setMobileOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  
  // Desktop: Fixed sidebar
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col transition-all duration-300 ease-spring bg-sidebar text-sidebar-foreground",
          isCollapsed ? "w-20" : "w-64",
        )}
        style={{
         
        }}
      >
        <SidebarContent collapsed={isCollapsed} setCollapsed={toggleCollapse} />
      </aside>
    </Suspense>
  );
}