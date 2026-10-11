import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/useSocket";
import api from "../api/axios";
import { getNotificationsByUser } from "../services/notification.service";

export default function Navbar() {
  const { user, logout, login } = useAuth();
  const { socket } = useSocket();
  const [loadingHost, setLoadingHost] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const role = user?.user?.role;

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.user?.id) return;
    try {
      const notifications = await getNotificationsByUser(user.user.id);
      setUnreadCount(notifications.filter((n) => !n.read).length);
    } catch { /* silent */ }
  }, [user?.user?.id]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!socket) return;
    const handler = () => { setUnreadCount((prev) => prev + 1); };
    socket.on("notification", handler);
    return () => { socket.off("notification", handler); };
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBecomeHost = async () => {
    setLoadingHost(true);
    try {
      const { data } = await api.patch("/users/become-host");
      login({
        token: data.token,
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role?.name || "host",
        },
      });
      toast.success("Ahora eres host!");
      setMenuOpen(false);
    } catch {
      toast.error("Error al cambiar de rol");
    } finally {
      setLoadingHost(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link to="/dashboard" className="text-xl sm:text-2xl font-bold text-indigo-600 shrink-0">
          StayHub
        </Link>

        {/* Search bar - hidden on mobile */}
        <div className="hidden md:flex items-center gap-3 border px-4 py-2 rounded-full shadow-sm hover:shadow-md transition flex-1 max-w-md">
          <span className="text-sm">Cualquier lugar</span>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm">Cualquier semana</span>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm">¿Cuántos?</span>
        </div>

        {/* Bubble menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 border px-3 py-2 rounded-full hover:shadow-md transition cursor-pointer"
          >
            {/* Hamburger icon */}
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {/* Avatar */}
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user?.name || "U")}&background=random`}
              className="w-8 h-8 rounded-full"
              alt="avatar"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">

              {/* User info */}
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-sm">{user?.user?.name}</p>
                <p className="text-xs text-gray-500">{user?.user?.email}</p>
                <span className="inline-block mt-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full capitalize font-medium">{role}</span>
              </div>

              <div className="py-1">
                <Link to="/listings" onClick={closeMenu} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                  Explorar
                </Link>
                <Link to="/favorites" onClick={closeMenu} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                  Favoritos
                </Link>
                <Link to="/my-bookings" onClick={closeMenu} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                  Mis Reservas
                </Link>
                <Link to="/my-payments" onClick={closeMenu} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                  Mis Pagos
                </Link>
                <Link to="/chat" onClick={closeMenu} className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                  <span>Mensajes</span>
                </Link>
                <Link to="/notifications" onClick={closeMenu} className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                  <span>Notificaciones</span>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="border-t py-1">
                <Link to="/profile" onClick={closeMenu} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                  Mi Perfil
                </Link>
              </div>

              {/* Role actions */}
              {(role === "host" || role === "admin") && (
                <div className="border-t py-1">
                  <Link to="/host" onClick={closeMenu} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition font-medium">
                    Panel Host
                  </Link>
                </div>
              )}

              {role === "admin" && (
                <div className="border-t py-1">
                  <Link to="/admin" onClick={closeMenu} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition font-medium">
                    Panel Admin
                  </Link>
                </div>
              )}

              {role === "client" && (
                <div className="border-t py-1">
                  <button
                    onClick={handleBecomeHost}
                    disabled={loadingHost}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition font-medium text-indigo-600"
                  >
                    {loadingHost ? "..." : "Quiero ser Host"}
                  </button>
                </div>
              )}

              <div className="border-t py-1">
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition text-gray-500"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
