import twilio from "twilio";

export const sendSmsOtp = async (phone, otp) => {
  const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH,
  );
  
  await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: `+91${phone}`,
  });
  console.log("phone otp", otp)
};