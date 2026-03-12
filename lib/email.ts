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
