import mongoose from "mongoose";
import Message from "../models/Message.models.js";

export const getChatHistory = async (req, res) => {
  try {
    const myId = req.user.id;
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const messages = await Message.find({
      $or: [
        { from: myId, to: userId },
        { from: userId, to: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    console.error("Error en getChatHistory:", error);
    res.status(500).json({ message: "Error al obtener mensajes" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.user.id);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ from: myId }, { to: myId }],
          $expr: { $ne: ["$from", "$to"] },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $group: {
          _id: {
            participants: {
              $cond: [
                { $gt: [{ $toString: "$from" }, { $toString: "$to" }] },
                { from: "$to", to: "$from" },
                { from: "$from", to: "$to" },
              ],
            },
          },
          lastMessage: { $last: "$$ROOT" },
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 }, // últimas conversaciones primero
      },
    ]);

    res.json({ conversations });
  } catch (error) {
    console.error("Error en getConversations:", error);
    res.status(500).json({ message: "Error al obtener conversaciones" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { to, content, listing } = req.body;
    const from = req.user.id;

    if (!to || !content) {
      return res.status(400).json({
        message: "Destinatario y contenido son requeridos",
      });
    }

    if (!mongoose.isValidObjectId(to)) {
      return res.status(400).json({
        message: "El ID del destinatario no es válido",
      });
    }

    const message = await Message.create({
      from,
      to,
      content,
      listing,
    });

    req.io.to(to.toString()).emit("receive-message", message);

    req.io.to(from.toString()).emit("message-sent", message);

    return res.status(201).json({
      message: "Mensaje enviado correctamente",
      data: message,
    });
  } catch (error) {
    console.error("Error en sendMessage:", error);
    return res.status(500).json({
      message: "Error al enviar el mensaje",
      detalle: error.message,
    });
  }
};
