import express from "express";
import {
  getAllFoods,
  getAvailableFoods,
  createFood,
  updateFood,
  deleteFood
} from "../controllers/foodController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/**
 * Student Routes
 */
router.get("/getAllFoods", protect(["student"]), getAllFoods);

/**
 * Admin Routes
 */
router.get("/", protect(["superadmin"]), getAllFoods);

router.post(
  "/add",
  protect(["superadmin"]),
  upload.single("image"),   // ✅ added
  createFood
);

router.post(
  "/update/:id",
  protect(["superadmin"]),
  upload.single("image"),   // ✅ added
  updateFood
);

router.delete("/:id", protect(["superadmin"]), deleteFood);

export default router;