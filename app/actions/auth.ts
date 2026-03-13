"use server";

import { redirect } from "next/navigation";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createToken,
  setSessionCookie,
  getSession,
} from "@/lib/auth";
import { Role, VerificationStatus, EmailVerificationToken } from "@prisma/client";
import { sendResetEmail, sendVerificationEmail } from "@/lib/email";

function rolesToPayload(roles: { role: Role; status: VerificationStatus }[]) {
  return roles.map((r) => ({ role: r.role, status: r.status }));
}

function getDefaultDashboardPath(roles: { role: string; status: string }[]): string {
  const approved = roles.filter((r) => r.status === "APPROVED").map((r) => r.role);
  if (approved.includes("ADMIN")) return "/dashboard/admin";
  if (approved.includes("FARMER")) return "/dashboard/farmer";
  if (approved.includes("RETAILER")) return "/dashboard/retailer";
  if (approved.includes("CONSUMER")) return "/dashboard/consumer";
  return "/dashboard";
}

export async function signup(formData: FormData): Promise<never> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (password !== confirmPassword) {
    redirect("/signup?error=" + encodeURIComponent("Passwords do not match."));
  }

  // 1. STRICTOR VALIDATION
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    redirect("/signup?error=" + encodeURIComponent("Please enter a valid email address."));
  }

  // Password Requirement: 8+ chars, Upper, Lower, Number, Special
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    redirect("/signup?error=" + encodeURIComponent("Password must be 8+ characters and contain uppercase, lowercase, number, and special character."));
  }

  // Indian Phone: Starts with 6-9, 10 digits
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone || !phoneRegex.test(phone)) {
    redirect("/signup?error=" + encodeURIComponent("Please enter a valid 10-digit Indian mobile number."));
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=" + encodeURIComponent("An account with this email already exists."));
  }

  let user;
  try {
    const hashed = await hashPassword(password);
    user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || null,
        phone: phone || null,
        emailVerified: false, // New users start as unverified
      },
    });
  } catch (error: any) {
    console.error("Signup Database Error:", error);
    
    // Check for Prisma unique constraint violation (P2002)
    if (error.code === 'P2002') {
      const target = error.meta?.target || [];
      if (target.includes('email')) {
        redirect("/signup?error=" + encodeURIComponent("An account with this email already exists."));
      } else if (target.includes('phone')) {
        redirect("/signup?error=" + encodeURIComponent("This phone number is already registered to another account."));
      }
      redirect("/signup?error=" + encodeURIComponent("An account with this email or phone already exists."));
    }

    redirect("/signup?error=" + encodeURIComponent("Database error: " + (error.message || "Unknown error") + ". Ensure migrations are applied."));
  }

  // 2. GENERATE VERIFICATION CODE
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  const expirySeconds = parseInt(process.env.OTP_EXPIRY_SECONDS || "900");
  const expiresAt = new Date(Date.now() + expirySeconds * 1000);

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token: verifyCode,
      expiresAt,
    },
  });

  // 3. SEND EMAIL
  await sendVerificationEmail(email, verifyCode);

  // 4. PRE-APPROVED CONSUMER ROLE (Assigned but user is still unverified)
  await prisma.userRole.create({
    data: {
      userId: user.id,
      role: Role.CONSUMER,
      status: VerificationStatus.APPROVED,
    },
  });

  // Redirect to verify page with email hint
  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function verifyEmail(formData: FormData): Promise<never> {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;

  if (!email || !code) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}&error=Verification code is required.`);
  }

  const user = await prisma.user.findUnique({ 
    where: { email },
    include: { verificationTokens: true }
  });

  if (!user) {
    redirect("/signup?error=User not found.");
  }

  const validToken = user.verificationTokens.find(
    (t: EmailVerificationToken) => t.token === code && t.expiresAt > new Date()
  );

  if (!validToken) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}&error=Invalid or expired verification code.`);
  }

  // Success: Verify User
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true }
  });

  // Delete tokens
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id }
  });

  // Log in immediately
  const { roles: userRoles } = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: true }
  }) || { roles: [] };

  const token = await createToken({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roles: rolesToPayload(userRoles),
  });
  await setSessionCookie(token);

  redirect("/");
}

export async function login(formData: FormData): Promise<never> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/login?error=" + encodeURIComponent("Email and password are required."));
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: true },
  });
  if (!user) {
    redirect("/login?error=" + encodeURIComponent("Account not found. Please check your email or signup."));
  }

  if (!user.emailVerified) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}&error=Please verify your email to log in.`);
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    redirect("/login?error=" + encodeURIComponent("Incorrect password. If you forgot it, please ask an admin to reset it."));
  }

  const rolesPayload = rolesToPayload(user.roles);
  const token = await createToken({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roles: rolesPayload,
  });
  await setSessionCookie(token);
  redirect("/");
}

export async function logout(): Promise<void> {
  const { clearSessionCookie } = await import("@/lib/auth");
  await clearSessionCookie();
  redirect("/");
}

/** Request Farmer or Retailer role (creates PENDING, verification required) - legacy simple form */
export async function requestRoleVerification(formData: FormData): Promise<never> {
  const session = await (await import("@/lib/auth")).getSession();
  if (!session) redirect("/login");

  const role = formData.get("role") as string;
  if (role !== "FARMER" && role !== "RETAILER") {
    redirect("/dashboard?error=" + encodeURIComponent("Invalid role."));
  }

  const businessName = (formData.get("businessName") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!businessName || !address || !phone) {
    redirect(
      `/dashboard/${role.toLowerCase()}?error=` +
        encodeURIComponent("Business name, address, and phone are required.")
    );
  }

  const r = role === "FARMER" ? Role.FARMER : Role.RETAILER;
  const existing = await prisma.userRole.findUnique({
    where: { userId_role: { userId: session.userId, role: r } },
  });
  if (existing) {
    redirect(`/dashboard/${role.toLowerCase()}`);
  }

  await prisma.userRole.create({
    data: {
      userId: session.userId,
      role: r,
      status: VerificationStatus.PENDING,
      verificationData: { businessName, address, phone } as object,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { roles: true },
  });
  if (!user) redirect("/login");
  const rolesPayload = rolesToPayload(user.roles);
  const token = await createToken({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roles: rolesPayload,
  });
  await setSessionCookie(token);
  redirect(`/dashboard/${role.toLowerCase()}`);
}

/** Full Farmer verification: Full Name, Mobile, Aadhaar, Farm Location, Land Area, Type of Farming, Document URL */
export async function requestFarmerVerification(formData: FormData): Promise<never> {
  const session = await (await import("@/lib/auth")).getSession();
  if (!session) redirect("/login");

  const fullName = (formData.get("fullName") as string)?.trim();
  const mobile = (formData.get("mobile") as string)?.trim();
  const aadhaar = (formData.get("aadhaar") as string)?.trim();
  const farmLocation = (formData.get("farmLocation") as string)?.trim();
  const landArea = (formData.get("landArea") as string)?.trim();
  const farmingType = (formData.get("farmingType") as string)?.trim();
  const documentUrl = (formData.get("documentUrl") as string)?.trim();

  if (!fullName || !mobile || !aadhaar || !farmLocation || !landArea || !farmingType) {
    redirect(
      "/dashboard/farmer?error=" +
        encodeURIComponent("Full name, mobile, Aadhaar, farm location, land area, and farming type are required.")
    );
  }

  const existing = await prisma.userRole.findUnique({
    where: { userId_role: { userId: session.userId, role: Role.FARMER } },
  });
  if (existing) {
    redirect("/dashboard/farmer");
  }

  await prisma.userRole.create({
    data: {
      userId: session.userId,
      role: Role.FARMER,
      status: VerificationStatus.PENDING,
      verificationData: {
        fullName,
        mobile,
        aadhaar,
        farmLocation,
        landArea,
        farmingType,
        documentUrl: documentUrl || undefined,
      } as object,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { roles: true },
  });
  if (!user) redirect("/login");
  const token = await createToken({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roles: rolesToPayload(user.roles),
  });
  await setSessionCookie(token);
  redirect("/dashboard/farmer");
}

/** Full Retailer verification: Shop Name, Owner Name, GST Number, Shop Address, Business License URL, Contact */
export async function requestRetailerVerification(formData: FormData): Promise<never> {
  const session = await (await import("@/lib/auth")).getSession();
  if (!session) redirect("/login");

  const shopName = (formData.get("shopName") as string)?.trim();
  const ownerName = (formData.get("ownerName") as string)?.trim();
  const gstNumber = (formData.get("gstNumber") as string)?.trim();
  const shopAddress = (formData.get("shopAddress") as string)?.trim();
  const businessLicenseUrl = (formData.get("businessLicenseUrl") as string)?.trim();
  const contactNumber = (formData.get("contactNumber") as string)?.trim();

  if (!shopName || !ownerName || !gstNumber || !shopAddress || !contactNumber) {
    redirect(
      "/dashboard/retailer?error=" +
        encodeURIComponent("Shop name, owner name, GST number, shop address, and contact number are required.")
    );
  }

  const existing = await prisma.userRole.findUnique({
    where: { userId_role: { userId: session.userId, role: Role.RETAILER } },
  });
  if (existing) {
    redirect("/dashboard/retailer");
  }

  await prisma.userRole.create({
    data: {
      userId: session.userId,
      role: Role.RETAILER,
      status: VerificationStatus.PENDING,
      verificationData: {
        shopName,
        ownerName,
        gstNumber,
        shopAddress,
        businessLicenseUrl: businessLicenseUrl || undefined,
        contactNumber,
      } as object,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { roles: true },
  });
  if (!user) redirect("/login");
  const token = await createToken({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roles: rolesToPayload(user.roles),
  });
  await setSessionCookie(token);
  redirect("/dashboard/retailer");
}

/** Admin: Approve a pending role request */
export async function approveRole(
  userRoleId: string,
  _formData?: FormData
): Promise<never> {
  const session = await (await import("@/lib/auth")).getSession();
  if (!session) redirect("/login");
  const { hasRole } = await import("@/lib/auth");
  if (!hasRole(session, "ADMIN")) redirect("/dashboard");

  const userRole = await prisma.userRole.findUnique({
    where: { id: userRoleId },
    include: { user: { include: { roles: true } } },
  });
  if (!userRole || userRole.status !== VerificationStatus.PENDING) {
    redirect("/dashboard/admin/roles?error=" + encodeURIComponent("Invalid or already processed request."));
  }

  await prisma.userRole.update({
    where: { id: userRoleId },
    data: { status: VerificationStatus.APPROVED },
  });

  // Refresh session for the approved user if they're the current admin (unlikely) or we just approve - no need to refresh admin
  redirect("/dashboard/admin/roles?message=" + encodeURIComponent("Role approved successfully."));
}

/** Admin: Reject a pending role request */
export async function rejectRole(
  userRoleId: string,
  _formData?: FormData
): Promise<never> {
  const session = await (await import("@/lib/auth")).getSession();
  if (!session) redirect("/login");
  const { hasRole } = await import("@/lib/auth");
  if (!hasRole(session, "ADMIN")) redirect("/dashboard");

  const userRole = await prisma.userRole.findUnique({
    where: { id: userRoleId },
  });
  if (!userRole || userRole.status !== VerificationStatus.PENDING) {
    redirect("/dashboard/admin/roles?error=" + encodeURIComponent("Invalid or already processed request."));
  }

  await prisma.userRole.delete({ where: { id: userRoleId } });

  redirect("/dashboard/admin/roles?message=" + encodeURIComponent("Role request rejected."));
}

/** Admin: Reset a user's password */
export async function resetUserPassword(formData: FormData): Promise<never> {
  const session = await (await import("@/lib/auth")).getSession();
  if (!session) redirect("/login");
  const { hasRole } = await import("@/lib/auth");
  if (!hasRole(session, "ADMIN")) redirect("/dashboard");

  const userId = formData.get("userId") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!userId || !newPassword) {
    redirect(`/dashboard/admin/users/${userId}?error=` + encodeURIComponent("Password is required."));
  }

  if (newPassword.length < 8) {
    redirect(`/dashboard/admin/users/${userId}?error=` + encodeURIComponent("Password must be at least 8 characters."));
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  redirect(`/dashboard/admin/users/${userId}?message=` + encodeURIComponent("Password reset successfully."));
}

/** Simulate a Google OAuth login for demo purposes */
export async function mockGoogleLogin(): Promise<never> {
  const email = "google@example.com";
  let user = await prisma.user.findUnique({
    where: { email },
    include: { roles: true },
  });

  if (!user) {
    const hashed = await hashPassword("supersecret123");
    user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: "Google Demo User",
      },
      include: { roles: true }
    });
    
    await prisma.userRole.create({
      data: {
        userId: user.id,
        role: "CONSUMER",
        status: "APPROVED",
      },
    });

    user = (await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    }))!;
  }

  const rolesPayload = rolesToPayload(user.roles);
  const token = await createToken({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roles: rolesPayload,
  });
  await setSessionCookie(token);
  redirect("/");
}

/** Request Password Reset (mocking email by logging to console) */
export async function requestPasswordReset(formData: FormData): Promise<never> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) {
    redirect("/forgot-password?error=" + encodeURIComponent("Email is required."));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    await sendResetEmail(email, resetLink);
  }

  redirect("/forgot-password?message=" + encodeURIComponent("If an account exists, a password reset link has been sent to your email."));
}

/** Complete Password Reset */
export async function completePasswordReset(formData: FormData): Promise<never> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) {
    redirect("/reset-password?error=" + encodeURIComponent("Token and new password are required."));
  }
  if (password.length < 8) {
    redirect(`/reset-password?token=${token}&error=` + encodeURIComponent("Password must be at least 8 characters."));
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    redirect("/reset-password?error=" + encodeURIComponent("Invalid or expired reset token."));
  }

  const hashed = await hashPassword(password);
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashed },
  });

  await prisma.passwordResetToken.deleteMany({
    where: { userId: resetToken.userId },
  });

  redirect("/login?message=" + encodeURIComponent("Password reset successfully. You can now log in."));
}

/** Refresh the session cookie if it's still valid (sliding expiration) */
export async function touchSession(): Promise<{ success: boolean }> {
  const session = await getSession();
  if (!session) return { success: false };

  // Re-issue the token and reset the cookie
  const token = await createToken({
    userId: session.userId,
    email: session.email,
    name: session.name,
    roles: session.roles,
  });
  await setSessionCookie(token);
  return { success: true };
}
