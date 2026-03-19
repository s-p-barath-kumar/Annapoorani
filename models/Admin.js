import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    shift: {
      type: String,
      enum: ["Shift 1", "Shift 2"],
      required: true,
    },
    role: {
      type: String,
      enum: ["department_admin", "superadmin"],
      default: "department_admin",
    },
    phone: String,
    email: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);