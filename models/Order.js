import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  items: [
    {
      name: String,
      price: Number,
      image:String
    }
  ],
  totalAmount: Number
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);

