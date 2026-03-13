import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json({ error: "Missing Google Client ID configuration." }, { status: 500 });
  }

  const scope = "openid email profile";
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=online&prompt=select_account`;

  return NextResponse.redirect(authUrl);
}
