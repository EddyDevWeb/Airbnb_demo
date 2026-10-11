import express from "express";
import {
  createBooking,
  getBookingById,
  getAllBookings,
  getHostBookings,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} from "../controllers/booking.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
const BookingRouter = express.Router();

BookingRouter.post("/create", protect, createBooking);
BookingRouter.get("/GetAll", protect, getAllBookings);
BookingRouter.get("/host", protect, requireRole("host", "admin"), getHostBookings);
BookingRouter.get("/get/:id", protect, getBookingById);
BookingRouter.put("/update/:id", protect, updateBooking);
BookingRouter.put("/:id/status", protect, requireRole("host", "admin"), updateBookingStatus);
BookingRouter.delete("/delete/:id", protect, deleteBooking);

export default BookingRouter;
