import User from "../models/user.models.js";
import Favorite from "../models/Favorite.models.js";
import Listing from "../models/Listing.models.js";

export const addFavorite = async (req, res) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const existingFavorite = await Favorite.findOne({
      user: userId,
      listing: listingId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Favorite already exists" });
    }

    const favorite = new Favorite({
      user: userId,
      listing: listingId,
    });

    await favorite.save();

    res.status(201).json({ message: "Favorite added successfully", favorite });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.params.userId === "me" ? req.user.id : req.params.userId;

    const favorites = await Favorite.find({ user: userId }).populate("listing");

    res.status(200).json({ favorites });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      listing: listingId,
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
