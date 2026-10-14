import { useSession } from "next-auth/react";
import { useListBattle } from "@/services/queries/useBattle";

/**
 * Salas de outros jogadores esperando um desafiante — alimenta o contador "ao vivo" do botão de
 * batalha e do card da home. Reaproveita o polling de 30s do useListBattle.
 */
export function useOpenBattleRooms({ enabled = true }: { enabled?: boolean } = {}) {
  const { data: session } = useSession();
  const { data, isLoading } = useListBattle({ pageSize: 20, enabled });
  const currentUserId = session?.user?.id;

  const rooms = (data?.battles ?? []).filter(
    (room) => room.status === "WAITING_OPPONENT" && room.playerA.id !== currentUserId,
  );

  return { rooms, count: rooms.length, isLoading };
}
