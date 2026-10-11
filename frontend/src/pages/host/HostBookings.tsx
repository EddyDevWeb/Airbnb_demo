// src/pages/host/HostBookings.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getHostBookings, updateBookingStatus } from "../../services/host.service";
import type { Booking, Listing } from "../../types/listing";

export default function HostBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHostBookings()
            .then(setBookings)
            .catch(() => toast.error("Error al cargar reservas"))
            .finally(() => setLoading(false));
    }, []);

    const handleStatus = async (bookingId: string, statusName: string) => {
        try {
            const updated = await updateBookingStatus(bookingId, statusName);
            setBookings((prev) => prev.map((b) => (b._id === bookingId ? updated : b)));
            toast.success(`Reserva ${statusName === "confirmed" ? "confirmada" : "cancelada"}`);
        } catch {
            toast.error("Error al actualizar reserva");
        }
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

    if (loading) return <p>Cargando reservas...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Reservas Recibidas</h1>

            {bookings.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Aún no tienes reservas</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const listing = booking.listing as Listing;
                        const status = booking.status as { name: string; color: string };

                        return (
                            <div
                                key={booking._id}
                                className="bg-white rounded-xl p-5 flex flex-col sm:flex-row gap-4 shadow-sm border"
                            >
                                {listing && typeof listing === "object" && listing.images?.[0] && (
                                    <img
                                        src={listing.images[0]}
                                        alt={listing.title}
                                        className="w-full sm:w-40 h-32 object-cover rounded-lg"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold">
                                        {listing && typeof listing === "object" ? listing.title : "Propiedad"}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                                    </p>
                                    <p className="text-sm font-semibold mt-1">Total: ${booking.totalPrice}</p>
                                    {status && (
                                        <span
                                            className="text-xs font-semibold px-2 py-1 rounded-full inline-block mt-2"
                                            style={{ backgroundColor: status.color + "20", color: status.color }}
                                        >
                                            {status.name}
                                        </span>
                                    )}
                                </div>
                                {status?.name === "pending" && (
                                    <div className="flex sm:flex-col gap-2">
                                        <button
                                            onClick={() => handleStatus(booking._id, "confirmed")}
                                            className="text-sm text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => handleStatus(booking._id, "cancelled")}
                                            className="text-sm text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
