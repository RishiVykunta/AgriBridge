"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createToken,
  setSessionCookie,
} from "@/lib/auth";
import { Role, VerificationStatus } from "@prisma/client";

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
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (!email || !password) {
    redirect("/signup?error=" + encodeURIComponent("Email and password are required."));
  }
  if (password.length < 8) {
    redirect("/signup?error=" + encodeURIComponent("Password must be at least 8 characters."));
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=" + encodeURIComponent("An account with this email already exists."));
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: name || null,
      phone: phone || null,
    },
  });

  // One user → multiple roles: assign CONSUMER as first role (auto-approved)
  await prisma.userRole.create({
    data: {
      userId: user.id,
      role: Role.CONSUMER,
      status: VerificationStatus.APPROVED,
    },
  });

  const roles = [{ role: Role.CONSUMER, status: VerificationStatus.APPROVED }];
  const token = await createToken({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roles: rolesToPayload(roles),
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
