// src/pages/notifications/NotificationsPage.tsx
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
    getNotificationsByUser,
    markNotificationAsRead,
    deleteNotification,
} from "../../services/notification.service";
import type { Notification } from "../../types/chat.types";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";

export default function NotificationsPage() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!user?.user?.id) return;
        try {
            const data = await getNotificationsByUser(user.user.id);
            setNotifications(data);
        } catch {
            toast.error("Error al cargar notificaciones");
        } finally {
            setLoading(false);
        }
    }, [user?.user?.id]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (!socket) return;
        const handler = (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
            toast.info(notification.message);
        };
        socket.on("notification", handler);
        return () => { socket.off("notification", handler); };
    }, [socket]);

    const handleMarkRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
        } catch {
            toast.error("Error al marcar como leída");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
            toast.success("Notificación eliminada");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (loading) return <p className="text-center mt-10">Cargando notificaciones...</p>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Notificaciones</h1>
                {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {unreadCount} sin leer
                    </span>
                )}
            </div>

            {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-16 text-lg">No tienes notificaciones</p>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif._id}
                            className={`p-4 rounded-xl border transition ${
                                notif.read ? "bg-white" : "bg-blue-50 border-blue-200"
                            }`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <p className={`text-sm ${notif.read ? "text-gray-600" : "text-gray-800 font-medium"}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {!notif.read && (
                                        <button
                                            onClick={() => handleMarkRead(notif._id)}
                                            className="text-xs text-blue-500 hover:text-blue-700"
                                        >
                                            Marcar leída
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notif._id)}
                                        className="text-xs text-red-500 hover:text-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
