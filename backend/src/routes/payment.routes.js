import express from "express";
import {
  createPayment,
  getMyPayments,
  getPaymentById,
  getAllPayments,
  updatePaymentStatus,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create", protect, createPayment);
paymentRouter.get("/my", protect, getMyPayments);
paymentRouter.get("/get/:id", protect, getPaymentById);
paymentRouter.get("/all", protect, requireRole("admin"), getAllPayments);
paymentRouter.put("/status/:id", protect, requireRole("admin"), updatePaymentStatus);

export default paymentRouter;
