// src/pages/admin/AdminBookingStatuses.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllBookingStatuses, createBookingStatus, updateBookingStatus, deleteBookingStatus, type BookingStatus } from "../../services/bookingStatus.service";

export default function AdminBookingStatuses() {
    const [statuses, setStatuses] = useState<BookingStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", description: "", color: "#3b82f6", isFinal: false });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        getAllBookingStatuses()
            .then(setStatuses)
            .catch(() => toast.error("Error al cargar statuses"))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateBookingStatus(editingId, form);
                setStatuses((prev) => prev.map((s) => s._id === editingId ? { ...s, ...form } : s));
                toast.success("Status actualizado");
            } else {
                const newStatus = await createBookingStatus(form);
                setStatuses((prev) => [...prev, newStatus]);
                toast.success("Status creado");
            }
            setForm({ name: "", description: "", color: "#3b82f6", isFinal: false });
            setEditingId(null);
        } catch {
            toast.error("Error al guardar status");
        }
    };

    const handleEdit = (status: BookingStatus) => {
        setEditingId(status._id);
        setForm({ name: status.name, description: status.description, color: status.color, isFinal: status.isFinal });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este status?")) return;
        try {
            await deleteBookingStatus(id);
            setStatuses((prev) => prev.filter((s) => s._id !== id));
            toast.success("Status eliminado");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    if (loading) return <p>Cargando statuses...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Gestionar Estados de Reserva</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" required />
                    <input placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2" />
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-500">Color:</label>
                        <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.isFinal} onChange={(e) => setForm({ ...form, isFinal: e.target.checked })} className="rounded" />
                        Estado final
                    </label>
                </div>
                <div className="flex gap-3 mt-4">
                    <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                        {editingId ? "Actualizar" : "Crear Status"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", description: "", color: "#3b82f6", isFinal: false }); }} className="border px-6 py-2 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Nombre</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Descripción</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Color</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Final</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-500">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {statuses.map((status) => (
                            <tr key={status._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">{status.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{status.description}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-block w-6 h-6 rounded" style={{ backgroundColor: status.color }} />
                                </td>
                                <td className="px-6 py-4 text-sm">{status.isFinal ? "Sí" : "No"}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(status)} className="text-sm text-blue-500 hover:text-blue-700">Editar</button>
                                    <button onClick={() => handleDelete(status._id)} className="text-sm text-red-500 hover:text-red-700">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
