import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";
import { cookies } from "next/headers";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "12", 10);
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");
const COOKIE_NAME = "agribridge_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type RoleStatus = { role: string; status: string };

export type SessionPayload = {
  userId: string;
  email: string;
  name?: string;
  roles: RoleStatus[]; // one user → multiple roles with status
  exp: number;
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return compare(password, hashed);
}

export async function createToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const { roles, ...rest } = payload;
  return new SignJWT({ ...rest, roles: roles ?? [] })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Approved roles only (can access role dashboard) */
export function getApprovedRoles(session: SessionPayload | null): string[] {
  if (!session?.roles?.length) return [];
  return session.roles.filter((r) => r.status === "APPROVED").map((r) => r.role);
}

export function hasRole(session: SessionPayload | null, role: string, approvedOnly = true): boolean {
  const roles = approvedOnly ? getApprovedRoles(session) : (session?.roles ?? []).map((r) => r.role);
  return roles.includes(role);
}

/** Get status for a specific role (PENDING | APPROVED | SUSPENDED) or null if user doesn't have the role */
export function getRoleStatus(session: SessionPayload | null, role: string): string | null {
  if (!session?.roles?.length) return null;
  const r = session.roles.find((x) => x.role === role);
  return r?.status ?? null;
}
