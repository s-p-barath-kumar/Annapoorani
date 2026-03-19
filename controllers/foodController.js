import Food from "../models/Food.js";
import fs from "fs";

/**
 * @desc    Get all foods (Admin)
 */
export const getAllFoods = async (req, res) => {
  const foods = await Food.find();
  res.status(200).json(foods);
};

/**
 * @desc    Get available foods (Student)
 */
export const getAvailableFoods = async (req, res) => {
  const foods = await Food.find({ isAvailable: true });
  res.status(200).json(foods);
};

/**
 * @desc    Create new food (WITH IMAGE)
 */
export const createFood = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const food = await Food.create({
    name,
    price,
    image: req.file.path,
    imageId: req.file.filename, 
    isAvailable: true,
  });

  res.status(201).json(food);
};

/**
 * @desc    Update food (OPTIONAL IMAGE REPLACE)
 */
export const updateFood = async (req, res) => {
  const { name, price, isAvailable } = req.body;

  const food = await Food.findById(req.params.id);
  if (!food) {
    return res.status(404).json({ message: "Food not found" });
  }

  // update fields
  food.name = name ?? food.name;
  food.price = price ?? food.price;
  food.isAvailable = isAvailable ?? food.isAvailable;

  // if new image uploaded
  if (req.file) {

    // delete old image from cloud
    if (food.imageId) {
      await cloudinary.uploader.destroy(food.imageId);
    }

    food.image = req.file.path;
    food.imageId = req.file.filename;
  }



  await food.save();
  res.status(200).json(food);
};

/**
 * @desc    Delete food (ALSO DELETE IMAGE FILE)
 */
export const deleteFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    return res.status(404).json({ message: "Food not found" });
  }

  // delete image file
  const imagePath = food.image.split("/uploads/")[1];
  if (imagePath && fs.existsSync(`uploads/${imagePath}`)) {
    fs.unlinkSync(`uploads/${imagePath}`);
  }

  await food.deleteOne();
  res.status(200).json({ message: "Food deleted successfully" });
};