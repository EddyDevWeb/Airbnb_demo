// src/services/admin.service.ts
import api from "../api/axios";

export interface UserListItem {
    _id: string;
    name: string;
    email: string;
    role: { _id: string; name: string; description: string };
    createdAt: string;
}

export async function getAllUsers(): Promise<UserListItem[]> {
    const { data } = await api.get<{ users: UserListItem[] }>("/users");
    return data.users;
}

export async function updateUserRole(userId: string, roleName: string): Promise<UserListItem> {
    const { data } = await api.put<{ user: UserListItem }>(`/users/${userId}/role`, { roleName });
    return data.user;
}

export async function deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`);
}
