import RoleType from "../models/roleType.models.js";
import Category from "../models/Category.models.js";
import BookingStatus from "../models/statusBooking.models.js";

export const seedRoles = async () => {
  const roles = [
    { name: "client", description: "Usuario cliente que reserva alojamientos" },
    { name: "host", description: "Anfitrión que publica propiedades" },
    { name: "admin", description: "Administrador del sistema" },
  ];
  for (const role of roles) {
    await RoleType.updateOne({ name: role.name }, role, { upsert: true });
  }
  console.log("Roles Seeded");
};

export const seedCategories = async () => {
  const categories = [
    { name: "apartamento", description: "Apartamentos para estancias urbanas" },
    { name: "casa", description: "Casas independientes" },
    { name: "villa", description: "Villas de lujo" },
    { name: "cabaña", description: "Cabañas rurales" },
    { name: "loft", description: "Lofts modernos" },
  ];
  for (const cat of categories) {
    await Category.updateOne({ name: cat.name }, cat, { upsert: true });
  }
  console.log("Categories Seeded");
};

export const seedBookingStatuses = async () => {
  const statuses = [
    { name: "pending", description: "Reserva pendiente de confirmación", color: "#f59e0b", isFinal: false },
    { name: "confirmed", description: "Reserva confirmada", color: "#22c55e", isFinal: false },
    { name: "cancelled", description: "Reserva cancelada", color: "#ef4444", isFinal: true },
    { name: "completed", description: "Reserva completada", color: "#3b82f6", isFinal: true },
  ];
  for (const status of statuses) {
    await BookingStatus.updateOne({ name: status.name }, status, { upsert: true });
  }
  console.log("Booking Statuses Seeded");
};
