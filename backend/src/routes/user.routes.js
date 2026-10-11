import express from "express";
import {
  register,
  Login,
  getAllUsers,
  updateUserRole,
  deleteUser,
  becomeHost,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", Login);

userRouter.get("/", protect, requireRole("admin"), getAllUsers);
userRouter.put("/:id/role", protect, requireRole("admin"), updateUserRole);
userRouter.delete("/:id", protect, requireRole("admin"), deleteUser);

userRouter.patch("/become-host", protect, becomeHost);

export default userRouter;
