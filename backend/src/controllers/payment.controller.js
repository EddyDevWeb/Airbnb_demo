import Payment from "../models/Payment.models.js";

export const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, statusId, paymentMethodId } = req.body;
    const userId = req.user.id;

    if (!bookingId || !amount || !statusId || !paymentMethodId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const payment = new Payment({
      user: userId,
      booking: bookingId,
      amount,
      status: statusId,
      paymentMethod: paymentMethodId,
    });

    await payment.save();
    res.status(201).json({ message: "Payment created", payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("booking")
      .populate("status")
      .populate("paymentMethod")
      .sort({ createdAt: -1 });

    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("booking")
      .populate("status")
      .populate("paymentMethod");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("booking")
      .populate("status")
      .populate("paymentMethod")
      .sort({ createdAt: -1 });

    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { statusId } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: statusId },
      { new: true }
    ).populate("status");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment status updated", payment });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
