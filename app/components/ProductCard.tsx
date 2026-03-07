"use client";

import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

type PriceOption = {
  label: string;
  price: string;
};

type ProductCardProps = {
  name: string;
  brand: string;
  prices: PriceOption[];
  cutPrice?: string;
  save?: string;
  discount?: string;
  image?: string;
  availability?: "in_stock" | "out_of_stock";
  href?: string;
  description?: string;
  /** Optional: real DB product id for cart/wishlist wiring */
  productId?: string;
  /** Optional: whether the user is logged in (session present). Used for client redirects. */
  isLoggedIn?: boolean;
};

export function ProductCard({
  name,
  brand,
  prices,
  cutPrice,
  save,
  discount,
  image,
  availability = "in_stock",
  href = "#",
  description,
  productId,
  isLoggedIn,
}: ProductCardProps) {
  const router = useRouter();
  const selectedPrice =
    prices && prices.length > 0 ? prices[0] : { label: "", price: "0" };
  const isOutOfStock = availability === "out_of_stock";
  const [inWishlist, setInWishlist] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // On initial render, check if this product is already in the wishlist
  useEffect(() => {
    if (!productId || !isLoggedIn) return;

    let cancelled = false;

    (async () => {
      try {
        const params = new URLSearchParams({ productId });
        const res = await fetch(`/api/wishlist?${params.toString()}`);
        if (!res.ok) return;
        const data = (await res.json()) as {
          inWishlist?: boolean;
          wishlistCount?: number;
        };
        if (!cancelled && typeof data.inWishlist === "boolean") {
          setInWishlist(data.inWishlist);
        }
        if (
          typeof window !== "undefined" &&
          typeof data.wishlistCount === "number"
        ) {
          window.dispatchEvent(
            new CustomEvent("agribridge:wishlist-updated", {
              detail: { count: data.wishlistCount },
            })
          );
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId, isLoggedIn]);

  const requireLogin = () => {
    if (isLoggedIn === false) {
      router.push("/login");
      return true;
    }
    return false;
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleWishlistToggle = () => {
    if (!productId || isOutOfStock) return;
    if (requireLogin()) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, mode: "toggle" }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          inWishlist?: boolean;
          wishlistCount?: number;
        };
        const active = !!data.inWishlist;
        setInWishlist(active);
        showToast(active ? "Added to wishlist" : "Removed from wishlist");

        if (
          typeof window !== "undefined" &&
          typeof data.wishlistCount === "number"
        ) {
          window.dispatchEvent(
            new CustomEvent("agribridge:wishlist-updated", {
              detail: { count: data.wishlistCount },
            })
          );
        }
      } catch {
        // ignore for now
      }
    });
  };

  const handleAddToCart = (opts?: { buyNow?: boolean }) => {
    if (!productId || isOutOfStock) return;
    if (requireLogin()) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: 1 }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as { cartCount?: number };

        if (typeof window !== "undefined" && typeof data.cartCount === "number") {
          window.dispatchEvent(
            new CustomEvent("agribridge:cart-updated", {
              detail: { count: data.cartCount },
            })
          );
        }

        if (opts?.buyNow) {
          router.push("/checkout");
        } else {
          showToast("Added to cart");
        }
      } catch {
        // ignore for now
      }
    });
  };

  return (
    <article
      className="group flex w-56 shrink-0 flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden 
      transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-500"
    >
      {/* IMAGE SECTION */}
      <div
        className="relative bg-zinc-100 overflow-hidden"
        style={{ height: "240px" }}
      >
        <Link href={href} className="block h-full">
          {/* OFFER BADGE */}
          {discount && (
            <span className="absolute left-3 top-3 z-20 rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
              {discount}
            </span>
          )}

          {/* PRODUCT IMAGE */}
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-zinc-300">
              📦
            </div>
          )}
        </Link>

        {/* WISHLIST BUTTON */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={isOutOfStock || isPending}
          className={`absolute right-3 top-3 rounded-full border p-2 shadow transition-all duration-200 ${
            inWishlist
              ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
              : "bg-white border-zinc-200 text-zinc-700 hover:bg-red-50 hover:text-red-500"
          } disabled:opacity-60`}
          aria-label="Toggle wishlist"
        >
          {inWishlist ? "♥" : "♡"}
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-900">
          {name}
        </h3>

        <p className="mt-1 text-xs text-zinc-500">{brand}</p>

        {/* DESCRIPTION */}
        {description && (
          <p className="mt-2 text-xs text-zinc-600 line-clamp-3">
            {description}
          </p>
        )}

        {/* PRICE SECTION */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-zinc-900">
              ₹{selectedPrice.price}
            </span>

            {cutPrice && (
              <span className="text-sm text-zinc-400 line-through">
                ₹{cutPrice}
              </span>
            )}

            {discount && (
              <span className="text-sm font-medium text-emerald-600">
                {discount}
              </span>
            )}
          </div>

          {save && (
            <p className="text-xs text-emerald-600">
              Save ₹{save}
            </p>
          )}
        </div>

        {/* SIZE SELECT (static display – first option) */}
        <div className="mt-3">
          <select
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            defaultValue={selectedPrice.label}
          >
            {prices.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {availability === "out_of_stock" && (
          <p className="mt-2 text-xs text-red-600">
            Currently Unavailable
          </p>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => handleAddToCart()}
            className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-zinc-300"
            disabled={isOutOfStock || isPending}
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={() => handleAddToCart({ buyNow: true })}
            className="flex-1 rounded-lg border border-emerald-600 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:border-zinc-300 disabled:text-zinc-400"
            disabled={isOutOfStock || isPending}
          >
            Buy Now
          </button>
        </div>

        {/* Lightweight toast */}
        {toast && (
          <div className="mt-2 rounded bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700">
            {toast}
          </div>
        )}
      </div>
    </article>
  );
}