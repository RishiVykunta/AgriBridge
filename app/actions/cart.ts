"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function addToCart(productId: string, quantity = 1): Promise<{ error?: string }> {
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
  if (quantity < 1) {
    return { error: "Invalid quantity." };
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId: session.userId, productId },
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: session.userId,
        productId,
        quantity,
      },
    });
  }
  // After a successful add/update, send the user to the cart so the change is visible.
  redirect("/cart");
}

export async function removeFromCart(productId: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  await prisma.cartItem.deleteMany({
    where: { userId: session.userId, productId },
  });
}

export async function updateCartQuantity(
  productId: string,
  quantity: number
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) redirect("/login");

  if (quantity < 1) {
    await removeFromCart(productId);
    return {};
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId: session.userId, productId },
    },
  });
  if (!existing) return { error: "Item not in cart." };

  await prisma.cartItem.update({
    where: { id: existing.id },
    data: { quantity },
  });
  return {};
}
