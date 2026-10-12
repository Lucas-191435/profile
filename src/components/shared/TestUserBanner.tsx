"use client";

import { Lock } from "lucide-react";
import { useIsTestUser } from "@/hooks/useIsTestUser";

export const TestUserBanner = () => {
  const isTestUser = useIsTestUser();
  if (!isTestUser) return null;

  return (
    <div
      data-tour="test-banner"
      className="flex items-center gap-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-200"
    >
      <Lock className="w-4 h-4 shrink-0 text-yellow-400" />
      <span>
        Você está com um <b>treinador de teste</b>: modo somente leitura. Os botões de edição ficam travados.
      </span>
    </div>
  );
};
