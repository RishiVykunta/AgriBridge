import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken, setSessionCookie, SessionPayload } from "@/lib/auth";
import crypto from "crypto";
import { Role, VerificationStatus } from "@prisma/client";

function rolesToPayload(roles: { role: Role; status: VerificationStatus }[]) {
  return roles.map((r) => ({ role: r.role, status: r.status }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent(error), request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=No+code+provided", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  const baseUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent("Server configuration error."), request.url));
  }

  // 1. Exchange code for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    console.error("Token exchange failed:", tokenData);
    return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent("Failed to authenticate with Google."), request.url));
  }

  // 2. Fetch user profile
  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData = await userResponse.json();

  if (!userData.email) {
    return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent("No email returned from Google."), request.url));
  }

  const email = userData.email.toLowerCase();
  
  // 3. Find or Create User
  let user = await prisma.user.findUnique({
    where: { email },
    include: { roles: true },
  });

  if (!user) {
    // Creating random password for OAuth user
    const randomPassword = crypto.randomBytes(16).toString("hex");
    const hashed = await hashPassword(randomPassword);
    
    user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: userData.name || "Google User",
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

  // 4. Create session token (identical to custom auth flow)
  const rolesPayload = rolesToPayload(user.roles);
  const jwtToken = await createToken({
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    roles: rolesPayload,
  });

  await setSessionCookie(jwtToken);

  // 5. Redirect home
  return NextResponse.redirect(new URL("/", request.url));
}
