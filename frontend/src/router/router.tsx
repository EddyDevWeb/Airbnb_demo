import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AppLayout from "../layouts/AppLayout";
import AdminLayout from "../layouts/AdminLayout";
import HostLayout from "../layouts/HostLayout";
import HomePage from "../pages/HomePage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ListingsPage from "../pages/listings/ListingsPage";
import ListingDetailPage from "../pages/listings/ListingDetailPage";
import MyBookingsPage from "../pages/bookings/MyBookingsPage";
import MyPaymentsPage from "../pages/payments/MyPaymentsPage";
import FavoritesPage from "../pages/profile/FavoritesPage";
import ProfilePage from "../pages/profile/ProfilePage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import ChatPage from "../pages/chat/ChatPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminRoles from "../pages/admin/AdminRoles";
import AdminBookingStatuses from "../pages/admin/AdminBookingStatuses";
import AdminNotificationTypes from "../pages/admin/AdminNotificationTypes";
import HostDashboard from "../pages/host/HostDashboard";
import HostListings from "../pages/host/HostListings";
import HostBookings from "../pages/host/HostBookings";
import NotFound from "../pages/NotFound";

import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user?.token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleRoute({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user?.token) return <Navigate to="/login" replace />;
  if (!roles.includes(user.user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/my-payments" element={<MyPaymentsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:userId" element={<ChatPage />} />
      </Route>

      <Route
        element={
          <RoleRoute roles={["host", "admin"]}>
            <HostLayout />
          </RoleRoute>
        }
      >
        <Route path="/host" element={<HostDashboard />} />
        <Route path="/host/listings" element={<HostListings />} />
        <Route path="/host/bookings" element={<HostBookings />} />
      </Route>

      <Route
        element={
          <RoleRoute roles={["admin"]}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/roles" element={<AdminRoles />} />
        <Route path="/admin/booking-statuses" element={<AdminBookingStatuses />} />
        <Route path="/admin/notification-types" element={<AdminNotificationTypes />} />
      </Route>

      <Route
        path="/"
        element={
          user?.token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <AppContent />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}
