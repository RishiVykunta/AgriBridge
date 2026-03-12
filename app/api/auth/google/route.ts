import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`;

  if (!clientId || !process.env.NEXTAUTH_URL) {
    return NextResponse.json({ error: "Missing Google Client ID or App URL configuration." }, { status: 500 });
  }

  const scope = "openid email profile";
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=online&prompt=select_account`;

  return NextResponse.redirect(authUrl);
}
