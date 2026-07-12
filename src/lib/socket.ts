import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

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