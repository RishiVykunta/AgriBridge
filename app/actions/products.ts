"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";
import { MainCategory, ProductStatus, MediaType } from "@prisma/client";

type ProductFormState = {
  error?: string;
};

/** Create a new product as Farmer / Retailer / Admin. Status = PENDING for Farmer/Retailer, APPROVED for Admin. */
export async function addProduct(
  _prevState: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const name = (formData.get("name") as string)?.trim();
  const brand = (formData.get("brand") as string)?.trim();
  const priceStr = (formData.get("price") as string)?.trim();
  const stockStr = (formData.get("stock") as string)?.trim();
  const discountStr = (formData.get("discountPercent") as string)?.trim();
  const availability = (formData.get("availability") as string)?.trim();
  const quantityValues = formData.getAll("quantityValue") as string[];
  const quantityUnits = formData.getAll("quantityUnit") as string[];
  const description = (formData.get("description") as string)?.trim();
  const mainCategoryStr = formData.get("mainCategory") as string;
  const subCategory = (formData.get("subCategory") as string)?.trim();
  const isTodayOffer = formData.get("isTodayOffer") != null;
  const isNewArrival = formData.get("isNewArrival") != null;
  const isTrending = formData.get("isTrending") != null;

  const imageUrls = (formData.getAll("imageUrls") as string[])
    .map((u) => u.trim())
    .filter(Boolean);
  const videoUrl = (formData.get("videoUrl") as string)?.trim();

  if (!name || !brand || !priceStr || !stockStr || !description) {
    return { error: "All basic fields are required." };
  }
  if (!mainCategoryStr || !subCategory) {
    return { error: "Please select a main category and subcategory." };
  }

  const price = Number(priceStr);
  let stock = Number(stockStr);
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Price must be a positive number." };
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "Stock must be a non‑negative integer." };
  }

  let discountPercent: number | null = null;
  if (discountStr) {
    const d = Number(discountStr);
    if (!Number.isFinite(d) || d < 0 || d > 100) {
      return { error: "Discount must be between 0 and 100." };
    }
    discountPercent = d;
  }

  if (availability === "out_of_stock") {
    stock = 0;
  }

  // Build pack sizes (quantity + unit pairs) from repeated fields
  const packSizes: { value: number; unit: string }[] = [];
  const maxLen = Math.max(quantityValues.length, quantityUnits.length);
  for (let i = 0; i < maxLen; i++) {
    const valueStr = (quantityValues[i] ?? "").trim();
    const unit = (quantityUnits[i] ?? "").trim();
    if (!valueStr && !unit) continue; // ignore completely empty row
    if (!valueStr || !unit) {
      return { error: "If you specify a pack size, both value and unit are required." };
    }
    const q = Number(valueStr);
    if (!Number.isFinite(q) || q <= 0) {
      return { error: "Pack size value must be a positive number." };
    }
    packSizes.push({ value: q, unit });
  }

  let mainCategory: MainCategory;
  try {
    mainCategory = MainCategory[mainCategoryStr as keyof typeof MainCategory];
  } catch {
    return { error: "Invalid main category." };
  }

  if (imageUrls.length === 0) {
    return { error: "At least one product image is required." };
  }

  const isAdmin = hasRole(session, "ADMIN", false);
  const isFarmer = hasRole(session, "FARMER");
  const isRetailer = hasRole(session, "RETAILER");

  if (!isAdmin && !isFarmer && !isRetailer) {
    return { error: "Only approved Farmers, Retailers, or Admins can add products." };
  }

  const status = isAdmin ? ProductStatus.APPROVED : ProductStatus.PENDING;

  const product = await prisma.product.create({
    data: {
      name,
      brand,
      price,
      stock,
      description,
      discountPercent: discountPercent ?? undefined,
      packSizes: packSizes.length ? (packSizes as unknown as any) : undefined,
      mainCategory,
      subCategory,
      isTodayOffer,
      isNewArrival,
      isTrending,
      status,
      sellerId: session.userId,
      media: {
        create: [
          ...imageUrls.map((url) => ({
            type: MediaType.IMAGE,
            url,
          })),
          ...(videoUrl
            ? [
                {
                  type: MediaType.VIDEO,
                  url: videoUrl,
                } as const,
              ]
            : []),
        ],
      },
    },
  });

  if (isAdmin) {
    redirect(`/dashboard/admin?message=${encodeURIComponent("Product added and approved.")}`);
  }

  // Farmer / Retailer flow – pending approval
  redirect(
    `/dashboard?message=${encodeURIComponent(
      `Product "${product.name}" submitted for admin approval.`
    )}`
  );
}

export async function approveProduct(productId: string): Promise<void> {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) {
    redirect("/login");
  }
  await prisma.product.update({
    where: { id: productId },
    data: { status: ProductStatus.APPROVED },
  });
}

export async function rejectProduct(productId: string): Promise<void> {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) {
    redirect("/login");
  }
  await prisma.product.update({
    where: { id: productId },
    data: { status: ProductStatus.REJECTED },
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) {
    redirect("/login");
  }

  await prisma.product.delete({ where: { id: productId } });
  redirect(
    `/dashboard/admin/catalog?message=${encodeURIComponent("Product deleted.")}`
  );
}

/** Admin: update any product (keeps existing packSizes if none provided). */
export async function updateProduct(
  productId: string,
  _prevState: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) {
    redirect("/login");
  }

  const name = (formData.get("name") as string)?.trim();
  const brand = (formData.get("brand") as string)?.trim();
  const priceStr = (formData.get("price") as string)?.trim();
  const stockStr = (formData.get("stock") as string)?.trim();
  const discountStr = (formData.get("discountPercent") as string)?.trim();
  const availability = (formData.get("availability") as string)?.trim();
  const quantityValues = formData.getAll("quantityValue") as string[];
  const quantityUnits = formData.getAll("quantityUnit") as string[];
  const description = (formData.get("description") as string)?.trim();
  const mainCategoryStr = formData.get("mainCategory") as string;
  const subCategory = (formData.get("subCategory") as string)?.trim();
  const imageUrls = (formData.getAll("imageUrls") as string[])
    .map((u) => u.trim())
    .filter(Boolean);
  const videoUrl = (formData.get("videoUrl") as string)?.trim();

  if (!name || !brand || !priceStr || !stockStr || !description) {
    return { error: "All basic fields are required." };
  }
  if (!mainCategoryStr || !subCategory) {
    return { error: "Please select a main category and subcategory." };
  }

  const price = Number(priceStr);
  let stock = Number(stockStr);
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Price must be a positive number." };
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "Stock must be a non‑negative integer." };
  }

  let discountPercent: number | null = null;
  if (discountStr) {
    const d = Number(discountStr);
    if (!Number.isFinite(d) || d < 0 || d > 100) {
      return { error: "Discount must be between 0 and 100." };
    }
    discountPercent = d;
  }

  if (availability === "out_of_stock") {
    stock = 0;
  }

  // Build pack sizes (quantity + unit pairs) from repeated fields
  const packSizes: { value: number; unit: string }[] = [];
  const maxLen = Math.max(quantityValues.length, quantityUnits.length);
  for (let i = 0; i < maxLen; i++) {
    const valueStr = (quantityValues[i] ?? "").trim();
    const unit = (quantityUnits[i] ?? "").trim();
    if (!valueStr && !unit) continue; // ignore completely empty row
    if (!valueStr || !unit) {
      return { error: "If you specify a pack size, both value and unit are required." };
    }
    const q = Number(valueStr);
    if (!Number.isFinite(q) || q <= 0) {
      return { error: "Pack size value must be a positive number." };
    }
    packSizes.push({ value: q, unit });
  }

  let mainCategory: MainCategory;
  try {
    mainCategory = MainCategory[mainCategoryStr as keyof typeof MainCategory];
  } catch {
    return { error: "Invalid main category." };
  }

  if (imageUrls.length === 0) {
    return { error: "At least one product image is required." };
  }

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, packSizes: true },
  });
  if (!existing) {
    return { error: "Product not found." };
  }

  const nextPackSizes =
    packSizes.length > 0
      ? (packSizes as unknown as any)
      : existing.packSizes ?? undefined;

  const isTodayOffer = formData.get("isTodayOffer") != null;
  const isNewArrival = formData.get("isNewArrival") != null;
  const isTrending = formData.get("isTrending") != null;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      brand,
      price,
      stock,
      description,
      discountPercent: discountPercent ?? undefined,
      packSizes: nextPackSizes as any,
      mainCategory,
      subCategory,
      isTodayOffer,
      isNewArrival,
      isTrending,
      media: {
        deleteMany: {},
        create: [
          ...imageUrls.map((url) => ({
            type: MediaType.IMAGE,
            url,
          })),
          ...(videoUrl
            ? [
                {
                  type: MediaType.VIDEO,
                  url: videoUrl,
                } as const,
              ]
            : []),
        ],
      },
    },
  });

  redirect(
    `/dashboard/admin/catalog?message=${encodeURIComponent("Product updated.")}`
  );
}

