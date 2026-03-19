import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getDashboardStats,
    getAllStudents,
    superAdminTransactions,
    filterTransactions,
    totalTransaction,
} from "../controllers/superadminController.js";

const router = express.Router();

router.get("/dashboard", protect(["superadmin"]), getDashboardStats);

router.get("/students", protect(["superadmin"]), getAllStudents);

router.get("/transactions", protect(["superadmin"]), superAdminTransactions);

router.get("/transactions/filter", protect(["superadmin"]), filterTransactions);

router.get("/transactions/total", protect(["superadmin"]), totalTransaction);

export default router;