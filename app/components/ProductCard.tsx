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
  images?: string[];
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
  images = [],
}: ProductCardProps) {
  const router = useRouter();
  const selectedPrice =
    prices && prices.length > 0 ? prices[0] : { label: "", price: "0" };
  const isOutOfStock = availability === "out_of_stock";
  const [inWishlist, setInWishlist] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image Slider Logic
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleAddToCart = (e: React.MouseEvent, opts?: { buyNow?: boolean }) => {
    e.preventDefault();
    e.stopPropagation();
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
      onClick={() => router.push(href)}
      className="cursor-pointer group flex w-44 sm:w-full flex-col rounded-[32px] border border-zinc-200 bg-white overflow-hidden 
      transition-all duration-500 hover:shadow-2xl hover:border-emerald-500/50 hover:-translate-y-1.5"
    >
      {/* IMAGE SECTION */}
      <div
        className="relative bg-zinc-100 overflow-hidden h-[180px] sm:h-[260px]"
      >
        <div className="block h-full">
          {/* OFFER BADGE */}
          {discount && (
            <span className="absolute left-4 top-4 z-20 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/20">
              {discount}
            </span>
          )}

          {/* PRODUCT IMAGE SLIDER */}
          <div className="relative h-full w-full overflow-hidden">
             {images.length > 0 ? (
               <div 
                 className="flex h-full transition-transform duration-700 ease-in-out"
                 style={{ 
                   width: `${images.length * 100}%`,
                   transform: `translateX(-${(images.length > 0 ? currentImageIndex : 0) * (100 / (images.length || 1))}%)` 
                 }}
               >
                 {images.map((img, idx) => (
                   <div 
                     key={idx} 
                     className="h-full flex-shrink-0"
                     style={{ width: `${100 / (images.length || 1)}%` }}
                   >
                      <img
                        src={img}
                        alt={`${name} - ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                   </div>
                 ))}
               </div>
             ) : image ? (
               <img
                 src={image}
                 alt={name}
                 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
             ) : (
               <div className="flex h-full items-center justify-center text-4xl text-zinc-300 bg-zinc-50">
                 📦
               </div>
             )}

             {/* SLIDER DOTS */}
             {images.length > 1 && (
               <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                 {images.map((_, idx) => (
                   <div 
                     key={idx} 
                     className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-emerald-500' : 'w-1 bg-white/50'}`} 
                   />
                 ))}
               </div>
             )}
          </div>
        </div>

        {/* WISHLIST BUTTON */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={isOutOfStock || isPending}
          className={`absolute right-4 top-4 rounded-full border p-2.5 shadow-xl transition-all duration-300 ${
            inWishlist
              ? "bg-red-500 border-red-500 text-white hover:bg-red-600 scale-110"
              : "bg-white/80 backdrop-blur-md border-white/50 text-zinc-700 hover:bg-red-50 hover:text-red-500"
          } disabled:opacity-60 z-20`}
          aria-label="Toggle wishlist"
        >
          {inWishlist ? (
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          ) : (
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          )}
        </button>
        
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
             {brand}
           </span>
           {isOutOfStock && (
             <span className="text-[10px] font-black uppercase tracking-tighter text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 ml-auto">
               Sold Out
             </span>
           )}
        </div>

        <div className="group/title">
          <h3 className="line-clamp-2 text-sm font-bold text-zinc-900 leading-tight mb-2 group-hover/title:text-emerald-700 transition-colors">
            {name}
          </h3>
        </div>

        {/* PRICE SECTION */}
        <div className="mt-auto pt-4 border-t border-zinc-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-black text-zinc-900 tracking-tight">
              ₹{selectedPrice.price}
            </span>

            {cutPrice && (
              <span className="text-xs text-zinc-400 line-through font-medium">
                ₹{cutPrice}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={(e) => handleAddToCart(e)}
              className="w-full rounded-xl bg-emerald-600 text-white py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:bg-zinc-200 disabled:shadow-none flex items-center justify-center gap-2"
              disabled={isOutOfStock || isPending}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24 text-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span>Add to Cart</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleAddToCart(e, { buyNow: true })}
              className="w-full rounded-xl bg-zinc-900 text-white py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 disabled:bg-zinc-200 disabled:shadow-none flex items-center justify-center gap-2"
              disabled={isOutOfStock || isPending}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>Buy Now</span>
            </button>
          </div>
        </div>

        {/* Action feedback */}
        {toast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-50">
            {toast}
          </div>
        )}
      </div>
    </article>
  );
}