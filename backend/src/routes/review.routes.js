import express from "express";
import { createReview, getReviewsByListing, deleteReview } from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const reviewRouter = express.Router();

reviewRouter.post("/create", protect, createReview);
reviewRouter.get("/listing/:listingId", getReviewsByListing);
reviewRouter.delete("/delete/:id", protect, deleteReview);

export default reviewRouter;
