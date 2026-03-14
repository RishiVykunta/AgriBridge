import type { Product as UiProduct } from "@/app/components/ProductSection";
import type { Product, ProductMedia } from "@prisma/client";

function toNumberSafe(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(String(v ?? "").trim());
  if (!Number.isFinite(n)) return null;
  return n;
}

function getAllImageUrls(media?: ProductMedia[]): string[] {
  return (media ?? [])
    .filter((m) => m.type === "IMAGE")
    .map((m) => m.url);
}

function normalizePricesFromPackSizes(packSizes: unknown, fallbackPrice: number): UiProduct["prices"] {
  if (Array.isArray(packSizes)) {
    const withLabelPrice = packSizes
      .map((x) => {
        if (!x || typeof x !== "object") return null;
        const obj = x as Record<string, unknown>;
        const label = typeof obj.label === "string" ? obj.label : null;
        const price = toNumberSafe(obj.price);
        if (!label || !price || price <= 0) return null;
        return { label, price: String(Math.round(price)) };
      })
      .filter((x): x is { label: string; price: string } => !!x);

    if (withLabelPrice.length > 0) return withLabelPrice;

    const withValueUnit = packSizes
      .map((x) => {
        if (!x || typeof x !== "object") return null;
        const obj = x as Record<string, unknown>;
        const value = toNumberSafe(obj.value);
        const unit = typeof obj.unit === "string" ? obj.unit : null;
        if (!value || !unit) return null;
        return { label: `${value} ${unit}`, price: String(Math.round(fallbackPrice)) };
      })
      .filter((x): x is { label: string; price: string } => !!x);

    if (withValueUnit.length > 0) return withValueUnit;
  }

  return [{ label: "Default", price: String(Math.round(fallbackPrice)) }];
}

export function productToUiProduct(
  p: Product & { media?: ProductMedia[] }
): UiProduct {
  const basePrice = toNumberSafe((p as any).price?.toString?.() ?? (p as any).price) ?? 0;
  const discountPercent = typeof p.discountPercent === "number" ? p.discountPercent : null;

  const discount =
    discountPercent && discountPercent > 0 ? `${discountPercent}% OFF` : undefined;
  const cutPrice =
    discountPercent && discountPercent > 0
      ? String(Math.round(basePrice / (1 - discountPercent / 100)))
      : undefined;
  const save =
    cutPrice ? String(Math.max(0, Math.round(Number(cutPrice) - basePrice))) : undefined;

  return {
    productId: p.id,
    href: `/products/${p.id}`,
    name: p.name,
    brand: p.brand,
    prices: normalizePricesFromPackSizes(p.packSizes as unknown, basePrice),
    cutPrice,
    save,
    discount,
    image: getAllImageUrls(p.media)[0],
    images: getAllImageUrls(p.media),
    availability: p.stock <= 0 ? "out_of_stock" : "in_stock",
    description: p.description,
  };
}

