import Booking from "../models/Booking.models.js";
import Listing from "../models/Listing.models.js";
import BookingStatus from "../models/statusBooking.models.js";

// Crear un nuevo booking
export const createBooking = async (req, res) => {
  try {
    const { user, listing, startDate, endDate, totalPrice } = req.body;

    if (!user || !listing || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const listingExists = await Listing.findById(listing);
    if (!listingExists) {
      return res.status(404).json({
        message: "El listing no existe",
      });
    }

    const conflictingBooking = await Booking.findOne({
      listing,
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        message: "Este listing ya está reservado en ese rango de fechas",
      });
    }

    const pendingStatus = await BookingStatus.findOne({ name: "pending" });
    if (!pendingStatus) {
      return res.status(500).json({
        message: "Estado 'pending' no encontrado en BookingStatus",
      });
    }

    const newBooking = new Booking({
      user,
      listing,
      startDate,
      endDate,
      totalPrice,
      status: pendingStatus._id,
    });

    const savedBooking = await newBooking.save();

    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate("user")
      .populate("listing")
      .populate("status");

    res.status(201).json({
      message: "Booking creado exitosamente",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el booking",
      error: error.message,
    });
  }
};

// Obtener todos los bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("listing")
      .populate("status");

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los bookings",
      error: error.message,
    });
  }
};

// Obtener bookings del host
export const getHostBookings = async (req, res) => {
  try {
    const myListings = await Listing.find({ host: req.user.id }).select("_id");
    const listingIds = myListings.map((l) => l._id);

    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate("user", "name email")
      .populate("listing", "title location price images")
      .populate("status");

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las reservas del host",
      error: error.message,
    });
  }
};

// Obtener booking por ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("user")
      .populate("listing")
      .populate("status");

    if (!booking) {
      return res.status(404).json({
        message: "Booking no encontrado",
      });
    }

    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el booking",
      error: error.message,
    });
  }
};

// Eliminar booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking no encontrado",
      });
    }

    res.status(200).json({
      message: "Booking eliminado exitosamente",
      booking: deletedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el booking",
      error: error.message,
    });
  }
};

// Actualizar booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, totalPrice, statusId } = req.body;

    const updateData = { startDate, endDate, totalPrice };

    if (statusId) {
      const statusExists = await BookingStatus.findById(statusId);
      if (!statusExists) {
        return res.status(400).json({
          message: "El status proporcionado no existe",
        });
      }
      updateData.status = statusId;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("user")
      .populate("listing")
      .populate("status");

    if (!updatedBooking) {
      return res.status(404).json({
        message: "Booking no encontrado",
      });
    }

    res.status(200).json({
      message: "Booking actualizado exitosamente",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el booking",
      error: error.message,
    });
  }
};

// Actualizar status de booking (host confirma/rechaza)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusName } = req.body;

    const booking = await Booking.findById(id).populate("listing");
    if (!booking) {
      return res.status(404).json({ message: "Booking no encontrado" });
    }

    const listing = await Listing.findById(booking.listing._id);
    if (!listing) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    if (listing.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para modificar esta reserva" });
    }

    const status = await BookingStatus.findOne({ name: statusName });
    if (!status) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    booking.status = status._id;
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("user")
      .populate("listing")
      .populate("status");

    res.status(200).json({
      message: `Booking ${statusName === "confirmed" ? "confirmado" : statusName === "cancelled" ? "cancelado" : "actualizado"}`,
      booking: populated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el estado del booking",
      error: error.message,
    });
  }
};
