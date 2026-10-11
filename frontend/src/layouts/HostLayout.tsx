// src/layouts/HostLayout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";

const links = [
    { to: "/host", label: "Dashboard", icon: "🏠" },
    { to: "/host/listings", label: "Mis Propiedades", icon: "🏡" },
    { to: "/host/bookings", label: "Reservas Recibidas", icon: "📋" },
];

export default function HostLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-sm p-6 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <h2 className="text-xl font-bold text-indigo-600 mb-8">Panel Host</h2>
                <nav className="space-y-2 flex-1">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                                location.pathname === link.to
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <span>{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <Link
                    to="/dashboard"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition border-t mt-4 pt-4"
                >
                    ← Volver al sitio
                </Link>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-bold text-indigo-600">Panel Host</h2>
                </div>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
