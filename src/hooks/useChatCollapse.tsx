"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ChatCollapseContextType = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

const ChatCollapseContext = createContext<
  ChatCollapseContextType | undefined
>(undefined);

export function ChatCollapseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // useEffect(() => {
  //   // Check if we're in the browser environment
  //   if (typeof window !== "undefined") {
  //     const savedState = localStorage.getItem("sidebar-collapsed");
  //     // eslint-disable-next-line react-hooks/set-state-in-effect
  //     setIsCollapsed(savedState === "true");
  //   }
  // }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("ChatCollapse-collapsed", String(newState));
    }
  };

  return (
    <ChatCollapseContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </ChatCollapseContext.Provider>
  );
}

export function useChatCollapse() {
  const context = useContext(ChatCollapseContext);

  if (context === undefined) {
    throw new Error(
      "useChatCollapse must be used within a ChatCollapseProvider",
    );
  }

  return context;
}
