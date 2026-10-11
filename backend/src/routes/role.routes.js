import express from "express";
import {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
} from "../controllers/role.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const roleRouter = express.Router();

roleRouter.get("/get", getAllRoles);

roleRouter.post("/create", protect, requireRole("admin"), createRole);

roleRouter.put("/update/:id", protect, requireRole("admin"), updateRole);

roleRouter.delete("/delete/:id", protect, requireRole("admin"), deleteRole);

export default roleRouter;
