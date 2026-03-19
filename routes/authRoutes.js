import express from "express";
import { login, userData } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/login", login);
router.get("/me", protect(["student", "department_admin", "superadmin"]), userData);

export default router;
