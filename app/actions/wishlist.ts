"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function addToWishlist(productId: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, status: "APPROVED" },
  });
  if (!product) {
    return { error: "Product not found or not yet approved." };
  }

  await prisma.wishlistItem.upsert({
    where: {
      userId_productId: { userId: session.userId, productId },
    },
    create: { userId: session.userId, productId },
    update: {},
  });

  // After update, redirect to wishlist page so user sees the change.
  redirect("/wishlist");
}

export async function removeFromWishlist(productId: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  await prisma.wishlistItem.deleteMany({
    where: { userId: session.userId, productId },
  });
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId: session.userId, productId },
    },
  });
  return !!item;
}
