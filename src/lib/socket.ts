import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let battleSocket: Socket | null = null;

export function getSocket(token?: string): Socket {
    if (!socket) {
        socket = io(`${process.env.baseUrl}/chat`, {
            transports: ["websocket"],
            autoConnect: false,
            withCredentials: true,
            auth: { token: token ?? "" },
        });
    } else if (token) {
        (socket.auth as Record<string, unknown>).token = token;
    }

    return socket;
}

export function resetSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export function getBattleSocket(token?: string): Socket {
    if (!battleSocket) {
        battleSocket = io(`${process.env.baseUrl}/battle`, {
            transports: ["websocket"],
            autoConnect: false,
            withCredentials: true,
            auth: { token: token ?? "" },
        });
    } else if (token) {
        (battleSocket.auth as Record<string, unknown>).token = token;
    }

    return battleSocket;
}

export function resetBattleSocket(): void {
    if (battleSocket) {
        battleSocket.disconnect();
        battleSocket = null;
    }
}