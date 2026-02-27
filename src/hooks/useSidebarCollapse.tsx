"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SidebarCollapseContextType = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

const SidebarCollapseContext = createContext<
  SidebarCollapseContextType | undefined
>(undefined);

export function SidebarCollapseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebar-collapsed");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(savedState === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(newState));
    }
  };

  return (
    <SidebarCollapseContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}

export function useSidebarCollapse() {
  const context = useContext(SidebarCollapseContext);

  if (context === undefined) {
    throw new Error(
      "useSidebarCollapse must be used within a SidebarCollapseProvider",
    );
  }

  return context;
}
