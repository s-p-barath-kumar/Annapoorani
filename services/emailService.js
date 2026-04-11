import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ OTP Email
export const sendEmailOtp = async (email, otp) => {
  try {
    console.log("Sending OTP email to:", email, process.env.SENDGRID_API_KEY);

    const msg = {
      to: email.trim(),
      from: process.env.EMAIL_USER, // verified sender
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    };

    const response = await sgMail.send(msg);

    console.log("✅ OTP Email sent:", response[0].statusCode);
    return response;

  } catch (err) {
    console.error("❌ Error sending OTP:", err.response?.body || err);
    throw err;
  }
};

// ✅ Student Credentials Email
export const sendStudentCredentials = async (email, regNo, password) => {
  try {
        console.log("Sending credentials email to:", email, process.env.SENDGRID_API_KEY);
    const msg = {
      to: email.trim(),
      from: process.env.EMAIL_USER,
      subject: "Your Canteen Account Created",
      html: `
        <h2>Welcome to Annapoorna Smart Canteen</h2>

        <p>Your student account has been successfully created.</p>

        <b>Registration Number:</b> ${regNo} <br/>
        <b>Password:</b> ${password}

        <br/><br/>
        <p>Please login and change your password after first login.</p>
      `,
    };

    const response = await sgMail.send(msg);

    console.log("✅ Credentials Email sent:", response[0].statusCode);
    return response;

  } catch (err) {
    console.error("❌ Error sending credentials:", err.response?.body || err);
    throw err;
  }
};