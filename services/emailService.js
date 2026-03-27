import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify()
  .then(() => console.log("✅ SMTP Ready"))
  .catch(err => console.log("❌ SMTP Error:", err));


export const sendEmailOtp = async (email, otp) => {
  try {
    console.log("Sending OTP email to:", email, "with OTP:", otp);

    const cleanEmail = email.trim();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    console.log("✅ OTP Email sent:", info.response);
    return info;

  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    throw err; // important
  }
};


export const sendStudentCredentials = async (email, regNo, password) => {
  try {
    const cleanEmail = email.trim();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "Your Canteen Account Created",
      html: `
        <h2>Welcome to Annapoorna Smart Canteen</h2>

        <p>Your student account has been successfully created.</p>

        <b>Registration Number:</b> ${regNo} <br/>
        <b>Password:</b> ${password}

        <br/><br/>
        <p>Please login and change your password after first login.</p>
      `,
    });

    console.log(" Credentials Email sent:", info.response);
    return info;

  } catch (err) {
    console.error(" Error sending credentials:", err);
    throw err;
  }
};