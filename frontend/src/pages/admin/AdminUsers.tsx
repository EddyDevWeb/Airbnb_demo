// src/pages/admin/AdminUsers.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllUsers, updateUserRole, deleteUser, type UserListItem } from "../../services/admin.service";

const ROLES = ["client", "host", "admin"];

export default function AdminUsers() {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getAllUsers()
            .then((u) => { if (!cancelled) setUsers(u); })
            .catch(() => { if (!cancelled) toast.error("Error al cargar usuarios"); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === userId ? { ...u, role: { ...u.role, name: newRole } } : u
                )
            );
            toast.success("Rol actualizado");
        } catch {
            toast.error("Error al actualizar rol");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("¿Eliminar este usuario?")) return;
        try {
            await deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            toast.success("Usuario eliminado");
        } catch {
            toast.error("Error al eliminar usuario");
        }
    };

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Gestionar Usuarios</h1>
            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Nombre</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Email</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Rol</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">{u.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={u.role.name}
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        className="border rounded-lg px-3 py-1 text-sm"
                                    >
                                        {ROLES.map((r) => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(u._id)}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
