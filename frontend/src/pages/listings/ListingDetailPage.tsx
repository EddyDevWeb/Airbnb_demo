// src/pages/listings/ListingDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getListingById } from "../../services/listing.service";
import { addFavorite, getUserFavorites, removeFavorite } from "../../services/favorite.service";
import { getReviewsByListing, createReview, deleteReview, type Review } from "../../services/review.service";
import BookingForm from "../../components/BookingForm";
import useAuth from "../../hooks/useAuth";
import type { Listing, ListingHost, ListingCategory } from "../../types/listing";

export default function ListingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [state, setState] = useState<{
        listing: Listing | null;
        loading: boolean;
        error: string | null;
        isFavorited: boolean;
        favLoading: boolean;
        reviews: Review[];
        average: number;
        reviewCount: number;
    }>({ listing: null, loading: true, error: null, isFavorited: false, favLoading: false, reviews: [], average: 0, reviewCount: 0 });
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        Promise.all([
            getListingById(id),
            user?.user?.id ? getUserFavorites().catch(() => []) : Promise.resolve([]),
            getReviewsByListing(id).catch(() => ({ reviews: [], average: 0, count: 0 })),
        ]).then(([listing, favorites, reviewData]) => {
            if (!cancelled) {
                const isFav = favorites.some((f) => f.listing._id === id);
                setState({
                    listing, loading: false, error: null,
                    isFavorited: isFav, favLoading: false,
                    reviews: reviewData.reviews,
                    average: reviewData.average,
                    reviewCount: reviewData.count,
                });
            }
        }).catch(() => {
            if (!cancelled) setState((prev) => ({ ...prev, listing: null, loading: false, error: "No se pudo cargar la propiedad" }));
        });
        return () => { cancelled = true; };
    }, [id, user?.user?.id]);

    const handleFavorite = async () => {
        if (!id || state.favLoading || !user?.user?.id) return;
        setState((prev) => ({ ...prev, favLoading: true }));
        try {
            if (state.isFavorited) {
                await removeFavorite(id);
                setState((prev) => ({ ...prev, isFavorited: false, favLoading: false }));
                toast.success("Eliminado de favoritos");
            } else {
                await addFavorite(id);
                setState((prev) => ({ ...prev, isFavorited: true, favLoading: false }));
                toast.success("Agregado a favoritos");
            }
        } catch {
            setState((prev) => ({ ...prev, favLoading: false }));
            toast.error("Error al actualizar favorito");
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setSubmittingReview(true);
        try {
            const review = await createReview(id, reviewRating, reviewComment);
            setState((prev) => ({
                ...prev,
                reviews: [review, ...prev.reviews],
                reviewCount: prev.reviewCount + 1,
            }));
            setReviewComment("");
            setReviewRating(5);
            toast.success("Review publicada");
        } catch {
            toast.error("Error al publicar review");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            await deleteReview(reviewId);
            setState((prev) => ({
                ...prev,
                reviews: prev.reviews.filter((r) => r._id !== reviewId),
                reviewCount: prev.reviewCount - 1,
            }));
            toast.success("Review eliminada");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    const { listing, loading, error } = state;

    if (loading) return <p className="text-center mt-10">Cargando...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!listing) return <p className="text-center mt-10">Propiedad no encontrada</p>;

    const host = listing.host as ListingHost;
    const category = listing.category as ListingCategory;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Link to="/listings" className="text-sm text-gray-500 hover:underline mb-4 inline-block">
                ← Volver a alojamientos
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold">{listing.title}</h1>
                        {user?.user?.id && (
                            <button
                                onClick={handleFavorite}
                                disabled={state.favLoading}
                                className="bg-white border rounded-full p-3 hover:shadow-md transition"
                            >
                                {state.isFavorited ? "❤️" : "🤍"}
                            </button>
                        )}
                    </div>
                    <p className="text-gray-500 mb-4">{listing.location}</p>
                    {category && (
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 capitalize">
                            {category.name}
                        </span>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {listing.images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`${listing.title} ${i + 1}`}
                                className="w-full h-60 object-cover rounded-lg"
                            />
                        ))}
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                        <p className="text-gray-600 leading-relaxed">{listing.description}</p>
                    </div>

                    {host && (
                        <div className="border-t pt-6 mt-6">
                            <h2 className="text-xl font-semibold mb-3">Anfitrión</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                    {host.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold">{host.name}</p>
                                    <p className="text-sm text-gray-500">{host.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="border-t pt-6 mt-6">
                        <h2 className="text-xl font-semibold mb-3">
                            Reviews {state.reviewCount > 0 && `(${state.average} ★ · ${state.reviewCount})`}
                        </h2>

                        {user?.user?.id && (
                            <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <label className="text-sm font-medium">Tu rating:</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className={`text-2xl ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Escribe tu review (opcional)"
                                    className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
                                    rows={3}
                                />
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    {submittingReview ? "Publicando..." : "Publicar Review"}
                                </button>
                            </form>
                        )}

                        {state.reviews.length === 0 ? (
                            <p className="text-gray-500 text-sm">Aún no hay reviews para esta propiedad</p>
                        ) : (
                            <div className="space-y-4">
                                {state.reviews.map((rev) => {
                                    const reviewer = typeof rev.user === "object" ? rev.user : null;
                                    return (
                                        <div key={rev._id} className="bg-white border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-yellow-400">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {reviewer?.name || "Usuario"} · {new Date(rev.createdAt).toLocaleDateString()}
                                                    </p>
                                                    {rev.comment && (
                                                        <p className="text-sm text-gray-700 mt-2">{rev.comment}</p>
                                                    )}
                                                </div>
                                                {user?.user?.id && (reviewer?._id === user.user.id || user.user.role === "admin") && (
                                                    <button onClick={() => handleDeleteReview(rev._id)} className="text-xs text-red-500 hover:text-red-700">Eliminar</button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <BookingForm listing={listing} />
                        {user?.user?.id && host && (
                            <Link
                                to={`/chat/${host._id}`}
                                className="block w-full text-center border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 hover:shadow-md transition"
                            >
                                Contactar anfitrión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
