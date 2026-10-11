// src/components/BookingForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createBooking } from "../services/booking.service";
import useAuth from "../hooks/useAuth";
import type { Listing } from "../types/listing";

interface Props {
    listing: Listing;
}

export default function BookingForm({ listing }: Props) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    const nights = startDate && endDate
        ? Math.max(0, Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
          ))
        : 0;

    const totalPrice = nights * listing.price;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            toast.error("Selecciona las fechas de check-in y check-out");
            return;
        }

        if (new Date(endDate) <= new Date(startDate)) {
            toast.error("Check-out debe ser después de check-in");
            return;
        }

        if (!user?.user?.id) {
            toast.error("Debes iniciar sesión");
            return;
        }

        setLoading(true);
        try {
            await createBooking({
                user: user.user.id,
                listing: listing._id,
                startDate,
                endDate,
                totalPrice,
            });
            toast.success("Reserva creada exitosamente");
            navigate("/my-bookings");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Error al crear la reserva");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl shadow-sm p-6">
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-xl font-bold">${listing.price}</span>
                <span className="text-gray-500">/noche</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Check-in</label>
                    <input
                        type="date"
                        value={startDate}
                        min={today}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase mb-1">Check-out</label>
                    <input
                        type="date"
                        value={endDate}
                        min={startDate || today}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        required
                    />
                </div>
            </div>

            {nights > 0 && (
                <div className="border-t pt-3 mb-4 text-sm">
                    <div className="flex justify-between mb-1">
                        <span>${listing.price} x {nights} noches</span>
                        <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-3">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={loading || nights === 0}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? "Reservando..." : "Reservar"}
            </button>
        </form>
    );
}
