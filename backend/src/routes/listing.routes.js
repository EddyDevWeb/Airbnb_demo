import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const listingRouter = express.Router();

listingRouter.get("/get", getAllListings);
listingRouter.get("/getId/:id", getListingById);
listingRouter.get("/my", protect, requireRole("host", "admin"), getMyListings);
listingRouter.post("/create", protect, requireRole("host", "admin"), createListing);
listingRouter.put("/update/:id", protect, requireRole("host", "admin"), updateListing);
listingRouter.delete("/delete/:id", protect, requireRole("host", "admin"), deleteListing);

export default listingRouter;
