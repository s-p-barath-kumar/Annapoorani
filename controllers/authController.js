import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const userData = async (req, res) => {
  const { id, role } = req.user;

  if (role === "student") {
    const student = await Student.findById(id).select("-password");
    return res.json({
      role: "student",
      userData: student
    });
  }

  if (role === "department_admin") {
    const admin = await Admin.findById(id).select("-password");
    return res.json({ role: "department_admin", userData: admin });
  }

  if (role === "superadmin") {
    const admin = await Admin.findById(id).select("-password");
    return res.json({ role: "superadmin", userData: admin });
  }

  res.status(404).json({ message: "User not found" });
};

export const login = async (req, res) => {
  
  try {
    const { id, password } = req.body;
    
    if (!id || !password) {
      return res.status(400).json({
        message: "ID and Password are required",
      });
    }

    const student = await Student.findOne({ regNo: id });
    if (student) {
      const match = await bcrypt.compare(password, student.password);
      console.log("Student logged in:", student.password, password, match);

      if (!match) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: student._id, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        role: "student",
        userData: student
      });
    }

    const admin = await Admin.findOne({ userId: id });
    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (!match) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin._id, role: admin.role, userData: admin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({ token, role: admin.role, userData: admin });
    }

      return res.status(404).json({
        message: "Invalid user name or password",
      });
  }
  catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
