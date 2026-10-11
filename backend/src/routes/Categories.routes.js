import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/Create", protect, requireRole("admin"), createCategory);
categoriesRouter.get("/Get", getCategories);
categoriesRouter.put("/update/:id", protect, requireRole("admin"), updateCategory);
categoriesRouter.delete("/delete/:id", protect, requireRole("admin"), deleteCategory);

export default categoriesRouter;
