import Otp from "../models/otpModel.js";
import otpGenerator from "otp-generator";
import { sendEmailOtp } from "../services/emailService.js";
import { sendSmsOtp } from "../services/smsService.js";

const OTP_EXPIRY = 5 * 60 * 1000;

export const sendOtp = async (req, res) => {

  const { identifier, type } = req.body;

  try {

    const existing = await Otp.findOne({ identifier, type });

    if (existing) {

      await Otp.deleteOne({ _id: existing._id });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Generated OTP:", otp);

    const expiresAt = new Date(Date.now() + OTP_EXPIRY);

    await Otp.create({
      identifier,
      otp,
      type,
      expiresAt,
    });

    if (type === "email") {
      sendEmailOtp(identifier, otp);
    }

    if (type === "phone") {
      await sendSmsOtp(identifier, otp);
    }

    res.json({
      message: "OTP sent successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to send OTP",
    });

  }

};

export const verifyOtp = async (req, res) => {

  const { identifier, otp, type } = req.body;

  try {

    const record = await Otp.findOne({ identifier, type });

    if (!record) {
      return res.status(400).json({
        message: "OTP not found or expired",
      });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        message: "Too many attempts",
      });
    }

    if (record.otp !== otp) {

      record.attempts += 1;
      await record.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });

    }

    await Otp.deleteOne({ _id: record._id });

    res.json({
      message: "OTP verified",
    });

  } catch (error) {

    res.status(500).json({
      message: "Verification failed",
    });

  }

};