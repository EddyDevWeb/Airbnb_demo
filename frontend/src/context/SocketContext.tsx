// src/context/SocketContext.tsx
import { createContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface SocketContextValue {
    socket: Socket | null;
    isConnected: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<SocketContextValue>({ socket: null, isConnected: false });

let activeSocket: Socket | null = null;
let activeConnected = false;
let activeUserId: string | null = null;
const listeners = new Set<() => void>();

function emitChange() {
    listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
    listeners.add(cb);
    return () => { listeners.delete(cb); };
}

function getSnapshot(): boolean {
    return activeConnected;
}

function getSocketSnapshot(): Socket | null {
    return activeSocket;
}

export function SocketProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    useEffect(() => {
        const userId = user?.user?.id ?? null;

        // Same user, socket alive — skip
        if (userId === activeUserId && activeSocket?.connected) return;

        // Tear down old socket
        if (activeSocket) {
            activeSocket.removeAllListeners();
            activeSocket.disconnect();
            activeSocket = null;
            activeConnected = false;
        }

        if (!userId) {
            activeUserId = null;
            emitChange();
            return;
        }

        activeUserId = userId;

        const socket = io(SOCKET_URL, {
            transports: ["polling", "websocket"],
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: 20,
        });

        activeSocket = socket;

        socket.on("connect", () => {
            socket.emit("register", userId);
            activeConnected = true;
            emitChange();
        });

        socket.on("disconnect", () => {
            activeConnected = false;
            emitChange();
        });

        socket.on("connect_error", () => {
            activeConnected = false;
            emitChange();
        });

        emitChange();

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            activeSocket = null;
            activeConnected = false;
            activeUserId = null;
            emitChange();
        };
    }, [user?.user?.id]);

    const isConnected = useSyncExternalStore(subscribe, getSnapshot, () => false);

    const socket = useSyncExternalStore(subscribe, getSocketSnapshot, () => null);

    const value: SocketContextValue = { socket, isConnected };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}
