"use client";

import { useSession } from "next-auth/react";
import { Role } from "@/types/IUser";

// Usuários com role TEST são somente leitura: o backend (TestRoleGuard) bloqueia
// qualquer escrita, então o front trava os controles de edição antes do 403.
export const useIsTestUser = () => {
  const { data } = useSession();
  return data?.user?.role === Role.Test;
};
