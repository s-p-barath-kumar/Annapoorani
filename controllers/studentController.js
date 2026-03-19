import Student from "../models/Student.js";
import Order from "../models/Order.js";
import Food from "../models/Food.js";

export const getProfile = async (req, res) => {
  const student = await Student.findById(req.user.id).select("-password");
  res.json(student);
};

export const getFoods = async (req, res) => {
  const foods = await Food.find({ isAvailable: true });
  res.json(foods);
};

export const createOrder = async (req, res) => {
  const student = await Student.findById(req.user.id);
  const { items } = req.body;
  
  if (items.price > student.balance)
    return res.status(400).json({ message: "Insufficient balance" });

  student.balance -= items.price;
  await student.save();

    const order = await Order.create({
      studentId: student._id,
      items,
      totalAmount: items.price,
  });


  res.status(201).json(order);
};

export const getStudentOrders = async (req, res) => {
  const orders = await Order.find({ studentId: req.user.id });
  res.json(orders);
};
