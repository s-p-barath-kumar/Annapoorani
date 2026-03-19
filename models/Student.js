import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    regNo: {
      type: String,
      required: true,
      unique: true,
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
    phone: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    profilePic:{
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);