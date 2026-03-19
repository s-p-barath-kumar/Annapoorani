import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    regNo: { type: String, required: true },
    department: { type: String, required: true },
    shift: { type: String, required: true },

    phone: { type: String },
    email: { type: String },

    attendance: { type: Number },
    profilePic: { type: String },
    incomeCertificate: { type: String },
    aadhaarCard: { type: String },
    teacherSignature: { type: String },

    status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("StudentRequest", requestSchema);