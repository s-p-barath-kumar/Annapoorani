import "./config/env.js"; 
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import otpRoutes from "./routes/otpRoutes.js";
import "./config/cron.js";
import path from "path";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/request", requestRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
