import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  identifier: {
    type: String, // email or phone
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["email", "phone"],
  },

  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // auto delete after expiry
  },

  attempts: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Otp", otpSchema);