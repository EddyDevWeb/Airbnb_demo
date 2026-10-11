import Listing from "../models/Listing.models.js";
import User from "../models/user.models.js";
import { isValidObjectId } from "../utils/IsValidObjetct.js";

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("host", "name email")
      .populate("category", "name");

    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const listing = await Listing.findById(id)
      .populate("host", "name email")
      .populate("category", "name");

    if (!listing) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    res.status(200).json({ listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.id })
      .populate("host", "name email")
      .populate("category", "name");
    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      price,
      images,
      host,
      availability,
      category,
    } = req.body;

    if (!title || !description || !location || !price) {
      return res.status(400).json({
        message: "Faltan campos obligatorios",
      });
    }

    const hostId = host || req.user.id;

    if (!isValidObjectId(hostId)) {
      return res.status(400).json({ message: "Host ID inválido" });
    }

    const hostUser = await User.findById(hostId).populate("role");

    if (!hostUser) {
      return res.status(404).json({
        message: "El usuario especificado como host no existe",
      });
    }

    if (!hostUser.role || hostUser.role.name !== "host") {
      return res.status(403).json({
        message: "Este usuario no tiene permisos de host",
      });
    }

    if (category && !isValidObjectId(category)) {
      return res.status(400).json({ message: "Category ID inválido" });
    }

    const newListing = new Listing({
      title,
      description,
      location,
      price,
      images,
      host: hostId,
      availability,
      category,
    });

    const savedListing = await newListing.save();

    res.status(201).json({ listing: savedListing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    if (listing.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para editar esta propiedad" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("host", "name email")
      .populate("category", "name");

    res.status(200).json({ listing: updatedListing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    if (listing.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta propiedad" });
    }

    await Listing.findByIdAndDelete(id);

    res.status(200).json({ message: "Propiedad eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
