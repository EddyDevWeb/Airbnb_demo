// src/services/role.service.ts
import api from "../api/axios";

export interface Role {
    _id: string;
    name: string;
    description: string;
}

export async function getAllRoles(): Promise<Role[]> {
    const { data } = await api.get<{ data: Role[] }>("/roles/get");
    return data.data;
}

export async function createRole(name: string, description: string): Promise<Role> {
    const { data } = await api.post<{ data: Role }>("/roles/create", { name, description });
    return data.data;
}

export async function updateRole(id: string, name: string, description: string): Promise<Role> {
    const { data } = await api.put<{ data: Role }>(`/roles/update/${id}`, { name, description });
    return data.data;
}

export async function deleteRole(id: string): Promise<void> {
    await api.delete(`/roles/delete/${id}`);
}
