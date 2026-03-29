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

export const sendStudentCredentialsSms = async (phone, regNo, password) => {
  try {

    const client = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH,
    );
    
    const message = `
Welcome to Annapoorna Smart Canteen

Reg No: ${regNo}
Password: ${password}

Please login and change your password.
`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: `+91${phone}`,
    });

    console.log("✅ Credentials SMS sent");
  } catch (err) {
    console.error("❌ Credentials SMS Error:", err);
    throw err;
  }
};