import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ inWishlist: false });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ inWishlist: false });
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId: session.userId, productId },
    },
  });

  const total = await prisma.wishlistItem.count({
    where: { userId: session.userId },
  });

  return NextResponse.json({ inWishlist: !!existing, wishlistCount: total });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { productId, mode = "toggle" } = await req.json().catch(() => ({}));

  if (!productId || typeof productId !== "string") {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, status: "APPROVED" },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Product not found or not yet approved." },
      { status: 404 }
    );
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId: session.userId, productId },
    },
  });

  let inWishlist = false;

  if (mode === "remove" || (mode === "toggle" && existing)) {
    await prisma.wishlistItem.deleteMany({
      where: { userId: session.userId, productId },
    });
    inWishlist = false;
  } else {
    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId: session.userId, productId },
      },
      create: { userId: session.userId, productId },
      update: {},
    });
    inWishlist = true;
  }

  const total = await prisma.wishlistItem.count({
    where: { userId: session.userId },
  });

  return NextResponse.json({ ok: true, inWishlist, wishlistCount: total });
}

