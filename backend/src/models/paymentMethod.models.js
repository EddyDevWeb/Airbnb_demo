import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    fee: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },

    icon: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

export default mongoose.model("PaymentMethod", paymentMethodSchema);
