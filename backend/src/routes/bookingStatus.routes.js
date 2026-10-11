import express from "express";
import {
  getAllBookingStatuses,
  createBookingStatus,
  updateBookingStatus,
  deleteBookingStatus,
} from "../controllers/bookingStatus.Controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const bookingStatusRouter = express.Router();

bookingStatusRouter.get(
  "/booking-statuses/getAll",
  protect,
  getAllBookingStatuses
);
bookingStatusRouter.post(
  "/booking-statuses/create",
  protect,
  requireRole("admin"),
  createBookingStatus
);
bookingStatusRouter.put(
  "/booking-statuses/update/:id",
  protect,
  requireRole("admin"),
  updateBookingStatus
);
bookingStatusRouter.delete(
  "/booking-statuses/delete/:id",
  protect,
  requireRole("admin"),
  deleteBookingStatus
);

export default bookingStatusRouter;
