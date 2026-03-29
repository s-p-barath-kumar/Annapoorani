import Student from "../models/Student.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";
import StudentRequest from "../models/StudentRequest.js";
// import { sendStudentCredentials } from "../services/emailService.js";
import { sendStudentCredentialsSms } from "../services/smsService.js";

export const getStudents = async (req, res) => {

  const students = await Student.find({
    department: req.user.userData.department
  }).select("-password");
  res.json(students);
};

export const registerStudent = async (req, res) => {
  try {  
    const data = req.body;

    const deptShort = req.body.department
    .split(" ")[0]
    .replace(".", "")
    .toLowerCase();

    const phoneLast3 = req.body.phone.slice(-3);

    const random3 = Math.floor(100 + Math.random() * 900);

    const password = `${deptShort}${phoneLast3}@${random3}`;


    const hashedPassword = await bcrypt.hash(password, 10);

    const request = await StudentRequest.findOne({
      $and: [
        { regNo: req.body.regNo },
        { email: req.body.email },
        { phone: req.body.phone }
      ]
    });

    console.log("Request found for registration:", request);

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    // check duplicate student
    const existingStudent = await Student.findOne({
      $or: [
        { regNo: request.regNo },
        { email: request.email },
        { phone: request.phone }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already registered"
      });
    }

    
    const student = await Student.create({
      ...data,
      password: hashedPassword
    });
    // await sendStudentCredentials(req.body.email, req.body.regNo, password);

    await sendStudentCredentialsSms(req.body.phone, req.body.regNo, password);


    await StudentRequest.findByIdAndDelete(request._id);    

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server Error 11", error: error.message });
  }
};
export const allTransactions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;

    // Get department from logged admin
    const department = req.user.userData.department;

    // Find students of that department
    const students = await Student.find({ department }).select("_id");

    const studentIds = students.map(s => s._id);

    const orders = await Order.find({
      studentId: { $in: studentIds }
    }).populate("studentId","-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    console.log("responsed    ===  Orders: =====  ", orders, req.user.userData.department);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getStudentRequests = async (req, res) => {
  try {
  const students = await StudentRequest.find({ status: "pending" });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch student requests" });
  }
};
export const rejectStudent = async (req, res) => {
  try {

    const request = await StudentRequest.findOne({
      regNo: req.body.regNo,
      email: req.body.email,
      phone: req.body.phone
    });

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    await StudentRequest.findByIdAndDelete(request._id);

    res.json({
      message: "Request rejected"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};