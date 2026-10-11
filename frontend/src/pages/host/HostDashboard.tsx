// src/pages/host/HostDashboard.tsx
import { useEffect, useState } from "react";
import { getMyListings, getHostBookings } from "../../services/host.service";

export default function HostDashboard() {
    const [listingCount, setListingCount] = useState(0);
    const [bookingCount, setBookingCount] = useState(0);

    useEffect(() => {
        getMyListings().then((l) => setListingCount(l.length)).catch(() => {});
        getHostBookings().then((b) => setBookingCount(b.length)).catch(() => {});
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Host</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <p className="text-gray-500 text-sm">Mis Propiedades</p>
                    <p className="text-3xl font-bold mt-2">{listingCount}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <p className="text-gray-500 text-sm">Reservas Recibidas</p>
                    <p className="text-3xl font-bold mt-2">{bookingCount}</p>
                </div>
            </div>
        </div>
    );
}
