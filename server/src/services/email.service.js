import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"HireHelper" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "HireHelper - Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Welcome to HireHelper 👋</h2>

        <p>Use the OTP below to verify your email address.</p>

        <h1 style="letter-spacing:5px; color:#2563eb;">
          ${otp}
        </h1>

        <p>This OTP will expire in <strong>10 minutes</strong>.</p>

        <hr>

        <p style="color:gray;font-size:14px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};