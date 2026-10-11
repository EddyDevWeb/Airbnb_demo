import mongoose from "mongoose";

const statusPaymentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
    isFinal: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const StatusPayment = mongoose.model("StatusPayment", statusPaymentSchema);
export default StatusPayment;
