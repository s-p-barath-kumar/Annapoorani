import express from "express";
import {
  getStudents,
  registerStudent,
  allTransactions,
  getStudentRequests,
  rejectStudent
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/students", protect(["department_admin"]), getStudents);
router.post("/register-student", protect(["department_admin"]), registerStudent);
router.get("/allTransactions", protect(["department_admin"]), allTransactions);
router.get("/student-requests", protect(["department_admin"]), getStudentRequests);
router.delete("/reject-requests", protect(["department_admin"]), rejectStudent);

export default router;
