import express from "express";
import {
  getProfile,
  createOrder,
  getStudentOrders,
  getFoods
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect(["student"]), getProfile);
router.get("/orders", protect(["student"]), getStudentOrders);
router.post("/orders", protect(["student"]), createOrder);
router.get("/foods", protect(["student"]), getFoods);

export default router;
