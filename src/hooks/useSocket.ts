import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";

export function useSocket() {
    const { data: session } = useSession();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!session?.token) return;

        const socket = getSocket(session.token);

        if (!socket.connected) {
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
        socket: getSocket(),
        connected,
    };
}