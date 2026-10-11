// src/pages/host/HostListings.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getMyListings,
    createListing,
    updateListing,
    deleteListing,
} from "../../services/host.service";
import type { Listing } from "../../types/listing";

export default function HostListings() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        price: "",
        images: "",
        category: "",
    });
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

    const fetchListings = () => {
        setLoading(true);
        getMyListings()
            .then(setListings)
            .catch(() => toast.error("Error al cargar propiedades"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchListings();
        import("../../api/axios").then(({ default: api }) =>
            api.get("/categories/Get").then((r: { data: { categories?: { _id: string; name: string }[] } }) => setCategories(r.data.categories || []))
        );
    }, []);

    const resetForm = () => {
        setForm({ title: "", description: "", location: "", price: "", images: "", category: "" });
        setEditingId(null);
        setShowForm(false);
    };

    const openEdit = (listing: Listing) => {
        setEditingId(listing._id);
        setForm({
            title: listing.title,
            description: listing.description,
            location: listing.location,
            price: String(listing.price),
            images: listing.images.join(", "),
            category: typeof listing.category === "object" ? listing.category._id : (listing.category || ""),
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const images = form.images.split(",").map((s) => s.trim()).filter(Boolean);

        try {
            if (editingId) {
                await updateListing(editingId, {
                    title: form.title,
                    description: form.description,
                    location: form.location,
                    price: Number(form.price),
                    images,
                    category: form.category || undefined,
                } as Partial<Listing>);
                toast.success("Propiedad actualizada");
            } else {
                await createListing({
                    title: form.title,
                    description: form.description,
                    location: form.location,
                    price: Number(form.price),
                    images,
                    category: form.category || undefined,
                });
                toast.success("Propiedad creada");
            }
            resetForm();
            fetchListings();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Error al guardar propiedad");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta propiedad?")) return;
        try {
            await deleteListing(id);
            setListings((prev) => prev.filter((l) => l._id !== id));
            toast.success("Propiedad eliminada");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    if (loading) return <p>Cargando propiedades...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Mis Propiedades</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    {showForm ? "Cancelar" : "+ Nueva Propiedad"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                    <h2 className="text-lg font-semibold mb-4">{editingId ? "Editar Propiedad" : "Nueva Propiedad"}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            placeholder="Título"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="border rounded-lg px-3 py-2"
                            required
                        />
                        <input
                            placeholder="Ubicación"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="border rounded-lg px-3 py-2"
                            required
                        />
                        <input
                            placeholder="Precio por noche"
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="border rounded-lg px-3 py-2"
                            required
                        />
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="border rounded-lg px-3 py-2"
                        >
                            <option value="">Sin categoría</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder="Descripción"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="border rounded-lg px-3 py-2 sm:col-span-2"
                            rows={3}
                            required
                        />
                        <input
                            placeholder="URLs de imágenes (separadas por coma)"
                            value={form.images}
                            onChange={(e) => setForm({ ...form, images: e.target.value })}
                            className="border rounded-lg px-3 py-2 sm:col-span-2"
                        />
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                            {editingId ? "Guardar Cambios" : "Crear Propiedad"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="border px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {listings.map((listing) => (
                    <div
                        key={listing._id}
                        className="bg-white rounded-xl p-5 flex gap-4 shadow-sm border"
                    >
                        {listing.images?.[0] && (
                            <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-32 h-24 object-cover rounded-lg"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="font-bold">{listing.title}</h3>
                            <p className="text-sm text-gray-500">{listing.location}</p>
                            <p className="text-sm font-semibold mt-1">${listing.price}/noche</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => openEdit(listing)}
                                className="text-sm text-blue-500 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(listing._id)}
                                className="text-sm text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
                {listings.length === 0 && (
                    <p className="text-center text-gray-500 py-10">
                        Aún no tienes propiedades. ¡Crea una!
                    </p>
                )}
            </div>
        </div>
    );
}
