import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: {
      type: String, // store image URL
      required: true,
    },
  imageId: String,
  isAvailable: { type: Boolean, default: true }
});

export default mongoose.model("Food", foodSchema);
