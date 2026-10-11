// src/services/notification.service.ts
import api from "../api/axios";
import type { Notification, NotificationType } from "../types/chat.types";

export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
    const { data } = await api.get<{ notifications: Notification[] }>(`/notifications/get/${userId}`);
    return data.notifications || [];
}

export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
    const { data } = await api.get<{ notification: Notification }>(`/notifications/read/${notificationId}`);
    return data.notification;
}

export async function deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/delete/${notificationId}`);
}

export async function createNotification(payload: {
    user: string;
    typeName: string;
    message: string;
}): Promise<Notification> {
    const { data } = await api.post<{ notification: Notification }>("/notifications/create", payload);
    return data.notification;
}

export async function getNotificationTypes(): Promise<NotificationType[]> {
    const { data } = await api.get<{ data: NotificationType[] }>("/notification-types/getAll");
    return data.data;
}

export async function createNotificationType(payload: {
    name: string;
    sendEmail: boolean;
    sendInApp: boolean;
    description: string;
}): Promise<NotificationType> {
    const { data } = await api.post<{ data: NotificationType }>("/notification-types/create", payload);
    return data.data;
}

export async function updateNotificationType(id: string, payload: Partial<NotificationType>): Promise<NotificationType> {
    const { data } = await api.put<{ data: NotificationType }>(`/notification-types/update/${id}`, payload);
    return data.data;
}

export async function deleteNotificationType(id: string): Promise<void> {
    await api.delete(`/notification-types/delete/${id}`);
}
