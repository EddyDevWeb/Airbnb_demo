// src/pages/favorites/FavoritesPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserFavorites, removeFavorite, type Favorite } from "../../services/favorite.service";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserFavorites()
            .then(setFavorites)
            .catch(() => toast.error("Error al cargar favoritos"))
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (listingId: string) => {
        try {
            await removeFavorite(listingId);
            setFavorites((prev) => prev.filter((f) => f.listing._id !== listingId));
            toast.success("Eliminado de favoritos");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    if (loading) return <p className="text-center mt-10">Cargando favoritos...</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>

            {favorites.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-4">Aún no tienes favoritos</p>
                    <Link
                        to="/listings"
                        className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
                    >
                        Explorar alojamientos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => (
                        <div key={fav._id} className="bg-white rounded-xl overflow-hidden shadow-sm border">
                            <Link to={`/listing/${fav.listing._id}`}>
                                <img
                                    src={fav.listing.images?.[0]}
                                    alt={fav.listing.title}
                                    className="w-full h-48 object-cover"
                                />
                            </Link>
                            <div className="p-4">
                                <Link to={`/listing/${fav.listing._id}`} className="font-semibold hover:underline">
                                    {fav.listing.title}
                                </Link>
                                <p className="text-sm text-gray-500">{fav.listing.location}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="font-bold">${fav.listing.price}/noche</span>
                                    <button
                                        onClick={() => handleRemove(fav.listing._id)}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        Quitar
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
