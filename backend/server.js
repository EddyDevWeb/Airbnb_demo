import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import express from "express";
import { connectDB } from "./src/config/db.js";
import { seedNotificationTypes } from "./src/seed/notificationType.seed.js";
import { seedRoles, seedCategories, seedBookingStatuses } from "./src/seed/initial.seed.js";
import { socketMiddleware } from "./src/middlewares/socketMiddleware.js";

import userRouter from "./src/routes/user.routes.js";
import NotificationRouter from "./src/routes/notification.routes.js";
import bookingRouter from "./src/routes/booking.routes.js";
import NotificationTypeRouter from "./src/routes/notificationType.routes.js";
import MessageRouter from "./src/routes/message.routes.js";
import favoriteRouter from "./src/routes/favorite.route.js";
import bookingsStatusRouter from "./src/routes/bookingStatus.routes.js";
import listingRouter from "./src/routes/listing.routes.js";
import categoriesRouter from "./src/routes/Categories.routes.js";
import roleRouter from "./src/routes/role.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import cors from "cors";
import addressRouter from "./src/routes/address.routes.js";
import reviewRouter from "./src/routes/review.routes.js";
import paymentRouter from "./src/routes/payment.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

await connectDB();
await seedRoles();
await seedCategories();
await seedBookingStatuses();
await seedNotificationTypes();

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(socketMiddleware(io));

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/users", userRouter);
app.use("/api/notifications", NotificationRouter);
app.use("/api/notification-types", NotificationTypeRouter);
app.use("/api/chatAibnb", MessageRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/bookingsStatus", bookingsStatusRouter);
app.use("/api/listings", listingRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/roles", roleRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/payments", paymentRouter);

app.get("/", (req, res) => {
  res.send("Backend Airbnb funcionando");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
