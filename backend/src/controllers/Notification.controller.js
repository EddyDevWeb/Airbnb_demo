import Notification from "../models/Notification.models.js";
import { sendNotification } from "../sockets/notification.js";
import NotificationType from "../models/NotificationType.model.js";
import { sendEmail } from "../utils/email.js";
import User from "../models/user.models.js";

export const createNotification = async (req, res) => {
  try {
    const { user, typeName, message } = req.body;

    if (!user || !typeName || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const type = await NotificationType.findOne({ name: typeName });
    if (!type) {
      return res.status(400).json({ message: "Invalid notification type" });
    }

    const newNotification = new Notification({
      user,
      type: type._id,
      message,
    });

    const saved = await newNotification.save();

    if (type.sendInApp) {
      sendNotification(req.io, user, saved);
    }

    if (type.sendEmail) {
      const userData = await User.findById(user);

      if (!userData) {
        console.log("Usuario no encontrado para enviar email");
      } else if (!userData.email) {
        console.log("Usuario no tiene email registrado");
      } else {
        await sendEmail(userData.email, message);
      }
    }

    return res.status(201).json({
      message: "Notification sent successfully",
      notification: saved,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    return res.status(200).json({
      message: "Notification marked as read",
      notification: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const deleted = await Notification.findByIdAndDelete(notificationId);

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification deleted",
      notification: deleted,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};
