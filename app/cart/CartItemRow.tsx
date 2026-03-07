"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type CartItemRowProps = {
  productId: string;
  name: string;
  brand: string;
  image?: string;
  variantLabel?: string;
  unitPrice: number;
  initialQuantity: number;
};

export function CartItemRow({
  productId,
  name,
  brand,
  image,
  variantLabel,
  unitPrice,
  initialQuantity,
}: CartItemRowProps) {
  const router = useRouter();
  const [qty, setQty] = useState(initialQuantity);
  const [isPending, startTransition] = useTransition();

  const subtotal = unitPrice * qty;

  const updateQuantity = (nextQty: number) => {
    if (nextQty < 0 || isPending) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/cart/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: nextQty }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          quantity?: number;
          cartCount?: number;
        };

        const newQuantity = typeof data.quantity === "number" ? data.quantity : nextQty;

        // Update navbar cart count
        if (typeof window !== "undefined" && typeof data.cartCount === "number") {
          window.dispatchEvent(
            new CustomEvent("agribridge:cart-updated", {
              detail: { count: data.cartCount },
            })
          );
        }

        if (newQuantity <= 0) {
          // Item removed; just refresh the page so layout and totals update
          router.refresh();
        } else {
          setQty(newQuantity);
          // Refresh to update order summary totals
          router.refresh();
        }
      } catch {
        // ignore for now
      }
    });
  };

  return (
    <div className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <Link
        href={`/products/${productId}`}
        className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-zinc-100"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl text-zinc-300">
            📦
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2">
        <Link href={`/products/${productId}`}>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2">
              {name}
            </h3>
            <p className="text-xs text-zinc-500">{brand}</p>
            {variantLabel && (
              <p className="mt-1 text-xs text-zinc-600">
                Variant: {variantLabel}
              </p>
            )}
          </div>
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quantity control */}
          <div className="inline-flex items-center rounded-full border border-zinc-300 bg-zinc-50 text-xs">
            <button
              type="button"
              disabled={isPending || qty <= 0}
              onClick={() => updateQuantity(qty - 1)}
              className="px-3 py-1 text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
            >
              −
            </button>
            <span className="min-w-[32px] text-center text-zinc-900">{qty}</span>
            <button
              type="button"
              disabled={isPending}
              onClick={() => updateQuantity(qty + 1)}
              className="px-3 py-1 text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Price & subtotal */}
          <div className="text-right text-xs">
            <p className="text-zinc-500">
              Price:{" "}
              <span className="font-medium text-zinc-900">
                ₹{unitPrice.toFixed(0)}
              </span>
            </p>
            <p className="text-zinc-700">
              Subtotal:{" "}
              <span className="font-semibold text-emerald-700">
                ₹{subtotal.toFixed(0)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => updateQuantity(0)}
            className="text-xs font-medium text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

