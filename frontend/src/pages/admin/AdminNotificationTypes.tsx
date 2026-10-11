// src/pages/admin/AdminNotificationTypes.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getNotificationTypes,
    createNotificationType,
    updateNotificationType,
    deleteNotificationType,
} from "../../services/notification.service";
import type { NotificationType } from "../../types/chat.types";

export default function AdminNotificationTypes() {
    const [types, setTypes] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", description: "", sendEmail: false, sendInApp: true });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        getNotificationTypes()
            .then(setTypes)
            .catch(() => toast.error("Error al cargar tipos"))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateNotificationType(editingId, form);
                setTypes((prev) => prev.map((t) => t._id === editingId ? { ...t, ...form } : t));
                toast.success("Tipo actualizado");
            } else {
                const newType = await createNotificationType(form);
                setTypes((prev) => [...prev, newType]);
                toast.success("Tipo creado");
            }
            setForm({ name: "", description: "", sendEmail: false, sendInApp: true });
            setEditingId(null);
        } catch {
            toast.error("Error al guardar tipo");
        }
    };

    const handleEdit = (type: NotificationType) => {
        setEditingId(type._id);
        setForm({ name: type.name, description: type.description, sendEmail: type.sendEmail, sendInApp: type.sendInApp });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este tipo de notificación?")) return;
        try {
            await deleteNotificationType(id);
            setTypes((prev) => prev.filter((t) => t._id !== id));
            toast.success("Tipo eliminado");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    if (loading) return <p>Cargando tipos de notificación...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Tipos de Notificación</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input placeholder="Nombre (ej: booking_confirmed)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" required />
                    <input placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2" />
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.sendEmail} onChange={(e) => setForm({ ...form, sendEmail: e.target.checked })} className="rounded" />
                        Enviar por email
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.sendInApp} onChange={(e) => setForm({ ...form, sendInApp: e.target.checked })} className="rounded" />
                        Enviar in-app
                    </label>
                </div>
                <div className="flex gap-3 mt-4">
                    <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                        {editingId ? "Actualizar" : "Crear Tipo"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", description: "", sendEmail: false, sendInApp: true }); }} className="border px-6 py-2 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Nombre</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Descripción</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Email</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">In-App</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {types.map((type) => (
                            <tr key={type._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">{type.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{type.description}</td>
                                <td className="px-6 py-4 text-sm">{type.sendEmail ? "Sí" : "No"}</td>
                                <td className="px-6 py-4 text-sm">{type.sendInApp ? "Sí" : "No"}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(type)} className="text-sm text-blue-500 hover:text-blue-700">Editar</button>
                                    <button onClick={() => handleDelete(type._id)} className="text-sm text-red-500 hover:text-red-700">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
