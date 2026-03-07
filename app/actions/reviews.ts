"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Simplified \"verified buyer\": any logged‑in user may review for now.

export async function addReview(
  productId: string,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const ratingRaw = (formData.get("rating") as string) ?? "";
  const text = ((formData.get("text") as string) ?? "").trim();

  const rating = Number(ratingRaw);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5." };
  }
  if (!text) {
    return { error: "Review text is required." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, status: "APPROVED" },
  });
  if (!product) {
    return { error: "Product not found or not yet approved." };
  }

  await prisma.review.create({
    data: {
      productId,
      userId: session.userId,
      rating,
      text,
    },
  });

  return {};
}

