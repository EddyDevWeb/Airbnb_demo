// src/pages/admin/AdminRoles.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllRoles, createRole, updateRole, deleteRole, type Role } from "../../services/role.service";

export default function AdminRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", description: "" });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        getAllRoles()
            .then(setRoles)
            .catch(() => toast.error("Error al cargar roles"))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateRole(editingId, form.name, form.description);
                setRoles((prev) => prev.map((r) => r._id === editingId ? { ...r, name: form.name, description: form.description } : r));
                toast.success("Rol actualizado");
            } else {
                const newRole = await createRole(form.name, form.description);
                setRoles((prev) => [...prev, newRole]);
                toast.success("Rol creado");
            }
            setForm({ name: "", description: "" });
            setEditingId(null);
        } catch {
            toast.error("Error al guardar rol");
        }
    };

    const handleEdit = (role: Role) => {
        setEditingId(role._id);
        setForm({ name: role.name, description: role.description });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este rol?")) return;
        try {
            await deleteRole(id);
            setRoles((prev) => prev.filter((r) => r._id !== id));
            toast.success("Rol eliminado");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    if (loading) return <p>Cargando roles...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Gestionar Roles</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input placeholder="Nombre del rol" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" required />
                    <input placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2" />
                </div>
                <div className="flex gap-3 mt-4">
                    <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                        {editingId ? "Actualizar" : "Crear Rol"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", description: "" }); }} className="border px-6 py-2 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Nombre</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Descripción</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {roles.map((role) => (
                            <tr key={role._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">{role.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{role.description}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(role)} className="text-sm text-blue-500 hover:text-blue-700">Editar</button>
                                    <button onClick={() => handleDelete(role._id)} className="text-sm text-red-500 hover:text-red-700">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
