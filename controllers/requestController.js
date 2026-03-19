import Student from "../models/Student.js";
import StudentRequest from "../models/StudentRequest.js";

export const createStudentRequest = async (req, res) => {

  try {
    
    const {regNo, phone, email} = req.body
    
    const regExists = await Student.findOne({ regNo })

    if (regExists) {
      return res.status(400).json({ field: "regNo", message: "RegNo already exists" });
    }


    // check phone
    const phoneExists = await Student.findOne({ phone })
    if (phoneExists) {
      return res.status(400).json({ field: "phone", message: "Phone number already exists" });
    }

    // check email
    const emailExists = await Student.findOne({ email })

    if (emailExists) {
      return res.status(400).json({ field: "email", message: "Email already exists" });
    }

    const request = await StudentRequest.create({

      name: req.body.name,
      regNo,
      department: req.body.department,
      shift: req.body.shift,
      phone,
      email,
      attendance: req.body.attendance,
      profilePic: req.files.profilePic[0].path,
      incomeCertificate: req.files.incomeCertificate[0].path,
      aadhaarCard: req.files.aadhaarCard?.[0].path,
      teacherSignature: req.files.teacherSignature?.[0].path

    });

    res.status(201).json({
      message: "Registration request sent to admin",
      request
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};