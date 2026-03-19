import express from "express";
import { createStudentRequest } from "../controllers/requestController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "profilePic"},
    { name: "incomeCertificate" },
    { name: "aadhaarCard" },
    { name: "teacherSignature" }
  ]),
  createStudentRequest
);

export default router;