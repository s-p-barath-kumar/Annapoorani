import emailjs from "@emailjs/nodejs";

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_OTP_ID = process.env.EMAILJS_TEMPLATE_OTP_ID;
const TEMPLATE_CREDENTIALS_ID = process.env.EMAILJS_TEMPLATE_CREDENTIALS_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

export const sendEmailOtp = async (email, otp) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_OTP_ID,
      {
        to_email: email,
        otp: otp,
      },
      {
        publicKey: PUBLIC_KEY,
        privateKey: PRIVATE_KEY,
      }
    );

    console.log("OTP Sent");
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Credentials Email
export const sendStudentCredentials = async (
  email,
  regNo,
  password
) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_CREDENTIALS_ID,
      {
        to_email: email,
        reg_no: regNo,
        password: password,
      },
      {
        publicKey: PUBLIC_KEY,
        privateKey: PRIVATE_KEY,
      }
    );

    console.log("Credentials Sent");
    return response;
  } catch (error) {
    console.log(error);
  }
};