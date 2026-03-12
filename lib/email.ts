import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "fallback_key_for_build");

export async function sendResetEmail(email: string, resetLink: string) {
  try {
    await resend.emails.send({
      from: "AgriBridge <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `
    });
    console.log(`Reset email successfully sent to ${email}`);
  } catch (error) {
    console.error("Failed to send reset email:", error);
    throw new Error("Failed to send reset email.");
  }
}

export async function sendVerificationEmail(email: string, code: string) {
  try {
    await resend.emails.send({
      from: "AgriBridge <onboarding@resend.dev>",
      to: email,
      subject: "Verify your AgriBridge email",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #059669;">Welcome to AgriBridge!</h2>
          <p>Please use the following verification code to complete your registration:</p>
          <div style="background-color: #f3f4f6; padding: 12px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 4px; color: #1f2937;">
            ${code}
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">This code will expire in 15 minutes.</p>
        </div>
      `
    });
    console.log(`Verification email successfully sent to ${email}`);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email.");
  }
}
