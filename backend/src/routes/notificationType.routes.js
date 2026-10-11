import express from "express";
import {
  createNotificationType,
  getNotificationTypes,
  updateNotificationType,
  getNotificationTypeById,
  deleteNotificationType,
} from "../controllers/notificationType.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const NotificationTypeRouter = express.Router();

NotificationTypeRouter.post("/create", protect, requireRole("admin"), createNotificationType);
NotificationTypeRouter.get("/getAll", protect, getNotificationTypes);
NotificationTypeRouter.get("/get/:id", protect, getNotificationTypeById);
NotificationTypeRouter.put("/update/:id", protect, requireRole("admin"), updateNotificationType);
NotificationTypeRouter.delete("/delete/:id", protect, requireRole("admin"), deleteNotificationType);

export default NotificationTypeRouter;
