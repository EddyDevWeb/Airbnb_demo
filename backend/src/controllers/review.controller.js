import Review from "../models/Review.models.js";
import Listing from "../models/Listing.models.js";

export const createReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!listingId || !rating) {
      return res.status(400).json({ message: "listingId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const existing = await Review.findOne({ user: userId, listing: listingId });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this listing" });
    }

    const review = new Review({
      user: userId,
      listing: listingId,
      rating,
      comment: comment || "",
    });

    await review.save();
    res.status(201).json({ message: "Review created", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviewsByListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const reviews = await Review.find({ listing: listingId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const avgResult = await Review.aggregate([
      { $match: { listing: reviews[0]?.listing } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const average = avgResult.length > 0 ? avgResult[0].avg : 0;
    const count = avgResult.length > 0 ? avgResult[0].count : 0;

    res.status(200).json({ reviews, average: Math.round(average * 10) / 10, count });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
