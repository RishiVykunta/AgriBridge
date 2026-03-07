import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { productId, quantity } = await req.json().catch(() => ({}));

  if (!productId || typeof productId !== "string") {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 0) {
    return NextResponse.json(
      { error: "Invalid quantity." },
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

  if (qty === 0) {
    await prisma.cartItem.deleteMany({
      where: { userId: session.userId, productId },
    });
  } else {
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId: session.userId, productId },
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: qty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: session.userId,
          productId,
          quantity: qty,
        },
      });
    }
  }

  const sum = await prisma.cartItem.aggregate({
    where: { userId: session.userId },
    _sum: { quantity: true },
  });

  const cartCount = sum._sum.quantity ?? 0;
  const unitPrice = Number(product.price);
  const itemSubtotal = unitPrice * qty;

  return NextResponse.json({
    ok: true,
    quantity: qty,
    cartCount,
    itemSubtotal,
  });
}

