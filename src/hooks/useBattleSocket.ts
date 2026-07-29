import { useEffect, useState } from "react";
import { getBattleSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";

export function useBattleSocket() {
    const { data: session } = useSession();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!session?.token) return;

        const socket = getBattleSocket(session.token);

        if (socket.connected) {
            // Socket singleton reaproveitado de uma navegação anterior (ex.: revanche) —
            // o evento "connect" já disparou no passado e não disparará de novo, então o
            // estado precisa ser sincronizado aqui em vez de esperar por um evento futuro.
            setConnected(true);
        } else {
            socket.connect();
        }

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [session?.token]);

    return {
        socket: getBattleSocket(),
        connected,
    };
}
