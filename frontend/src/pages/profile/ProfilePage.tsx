// src/pages/profile/ProfilePage.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createAddress, getMyAddresses, deleteAddress, type Address } from "../../services/address.service";
import useAuth from "../../hooks/useAuth";

export default function ProfilePage() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ street: "", city: "", state: "", zipCode: "", country: "" });

    useEffect(() => {
        getMyAddresses()
            .then(setAddresses)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const addr = await createAddress(form);
            setAddresses((prev) => [...prev, addr]);
            setForm({ street: "", city: "", state: "", zipCode: "", country: "" });
            setShowForm(false);
            toast.success("Dirección creada");
        } catch {
            toast.error("Error al crear dirección");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAddress(id);
            setAddresses((prev) => prev.filter((a) => a._id !== id));
            toast.success("Dirección eliminada");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

            <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                <h2 className="text-xl font-semibold mb-4">Información de la cuenta</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Nombre</p>
                        <p className="font-medium">{user?.user?.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{user?.user?.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Rol</p>
                        <p className="font-medium capitalize">{user?.user?.role}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mis Direcciones</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        {showForm ? "Cancelar" : "+ Nueva"}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                        <input placeholder="Calle" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <input placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <input placeholder="Estado" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <input placeholder="Código postal" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <input placeholder="País" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Guardar</button>
                    </form>
                )}

                {loading ? (
                    <p className="text-gray-500">Cargando...</p>
                ) : addresses.length === 0 ? (
                    <p className="text-gray-500 py-4">No tienes direcciones guardadas</p>
                ) : (
                    <div className="space-y-3">
                        {addresses.map((addr) => (
                            <div key={addr._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm">
                                    <p className="font-medium">{addr.street}</p>
                                    <p className="text-gray-500">{addr.city}, {addr.state} {addr.zipCode}</p>
                                    <p className="text-gray-500">{addr.country}</p>
                                </div>
                                <button onClick={() => handleDelete(addr._id)} className="text-sm text-red-500 hover:text-red-700">Eliminar</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
