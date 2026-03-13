import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendVerificationEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: `"AgriBridge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your AgriBridge email",
      html: `
        <h2>Welcome to AgriBridge</h2>
        <p>Your verification code:</p>
        <h1 style="font-size: 24px; font-weight: bold; letter-spacing: 4px; background: #f3f4f6; padding: 10px; text-align: center;">${code}</h1>
        <p>This code will expire in 15 minutes.</p>
      `
    });

    console.log("Verification email sent");
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Email failed");
  }
}

export async function sendResetEmail(email: string, resetLink: string) {
  try {
    await transporter.sendMail({
      from: `"AgriBridge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });

    console.log("Reset email sent");
  } catch (error) {
    console.error("Reset email error:", error);
    throw new Error("Reset email failed");
  }
}
