// src/pages/bookings/MyBookingsPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBookings, deleteBooking } from "../../services/booking.service";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import type { Booking, Listing } from "../../types/listing";

export default function MyBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.user?.id) return;
        let cancelled = false;
        getAllBookings()
            .then((all) => {
                if (cancelled) return;
                const myBookings = all.filter((b) => {
                    const userId = typeof b.user === "string" ? b.user : b.user._id;
                    return userId === user.user.id;
                });
                setBookings(myBookings);
            })
            .catch(() => { if (!cancelled) toast.error("Error al cargar reservas"); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [user]);

    const handleCancel = async (id: string) => {
        if (!confirm("¿Cancelar esta reserva?")) return;
        try {
            await deleteBooking(id);
            setBookings((prev) => prev.filter((b) => b._id !== id));
            toast.success("Reserva cancelada");
        } catch {
            toast.error("Error al cancelar la reserva");
        }
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

    if (loading) return <p className="text-center mt-10">Cargando reservas...</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Mis Reservas</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-4">Aún no tienes reservas</p>
                    <Link
                        to="/listings"
                        className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
                    >
                        Explorar alojamientos
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const listing = booking.listing as Listing;
                        const status = booking.status as { name: string; color: string };

                        return (
                            <div
                                key={booking._id}
                                className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row gap-4 shadow-sm"
                            >
                                {listing && listing.images?.[0] && (
                                    <img
                                        src={listing.images[0]}
                                        alt={listing.title}
                                        className="w-full sm:w-40 h-32 object-cover rounded-lg"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">
                                        {listing ? listing.title : "Propiedad eliminada"}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {listing ? listing.location : ""}
                                    </p>
                                    <p className="text-sm mt-1">
                                        {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-sm font-semibold">
                                            Total: ${booking.totalPrice}
                                        </span>
                                        {status && (
                                            <span
                                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                                style={{ backgroundColor: status.color + "20", color: status.color }}
                                            >
                                                {status.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex sm:flex-col gap-2 justify-end">
                                    <button
                                        onClick={() => handleCancel(booking._id)}
                                        className="text-sm text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
