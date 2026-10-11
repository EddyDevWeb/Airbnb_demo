// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/admin.service";
import { getAllBookings } from "../../services/booking.service";

export default function AdminDashboard() {
    const [userCount, setUserCount] = useState(0);
    const [bookingCount, setBookingCount] = useState(0);

    useEffect(() => {
        getAllUsers().then((u) => setUserCount(u.length)).catch(() => {});
        getAllBookings().then((b) => setBookingCount(b.length)).catch(() => {});
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <p className="text-gray-500 text-sm">Usuarios Registrados</p>
                    <p className="text-3xl font-bold mt-2">{userCount}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <p className="text-gray-500 text-sm">Reservas Totales</p>
                    <p className="text-3xl font-bold mt-2">{bookingCount}</p>
                </div>
            </div>
        </div>
    );
}
