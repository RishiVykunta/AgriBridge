import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { addToCart } from "@/app/actions/cart";
import { addToWishlist } from "@/app/actions/wishlist";
import { addReview } from "@/app/actions/reviews";
import { ProductGallery } from "@/app/products/ProductGallery";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const [session, product] = await Promise.all([
    getSession(),
    prisma.product.findUnique({
      where: { id },
      include: {
        media: true,
        reviews: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
  ]);

  if (!product || product.status !== "APPROVED") {
    notFound();
  }

  // Variant labels derived from packSizes (if any)
  let variantOptions: string[] = [];
  if (Array.isArray(product.packSizes)) {
    const raw = product.packSizes as unknown as Record<string, unknown>[];
    const byLabel = raw
      .map((x) => {
        const label = typeof x.label === "string" ? x.label : null;
        return label;
      })
      .filter((x): x is string => !!x);

    const byValueUnit = raw
      .map((x) => {
        const value =
          typeof x.value === "number"
            ? x.value
            : Number(String(x.value ?? "").trim());
        const unit = typeof x.unit === "string" ? x.unit : null;
        if (!Number.isFinite(value) || !unit) return null;
        return `${value} ${unit}`;
      })
      .filter((x): x is string => !!x);

    variantOptions = byLabel.length > 0 ? byLabel : byValueUnit;
  }

  const reviews = product.reviews;
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount === 0
      ? null
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

  const addToCartAction = async () => {
    "use server";
    await addToCart(product.id, 1);
  };
  const addToWishlistAction = async () => {
    "use server";
    await addToWishlist(product.id);
  };
  const addReviewAction = async (formData: FormData) => {
    "use server";
    await addReview(product.id, formData);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-24">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb - Clean & Minimal */}
        <nav className="mb-10 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-3 text-zinc-400">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span className="text-zinc-200">/</span>
            <Link href={`/crop-nutrition/${product.mainCategory.toLowerCase()}`} className="hover:text-emerald-600 transition-colors">{product.mainCategory}</Link>
            <span className="text-zinc-200">/</span>
            <span className="text-zinc-900 line-clamp-1">{product.name}</span>
          </div>
          <Link href="/" className="text-emerald-600 font-bold hover:underline">
            ← Explore Store
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start relative border-t border-zinc-100">
          {/* Left: Sticky Image Half - Exactly 50% width on LG */}
          <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col items-center justify-center bg-zinc-50/50 border-r border-zinc-100 p-8 lg:p-12">
            <div className="w-full max-w-xl">
              <ProductGallery name={product.name} media={product.media as any} />
            </div>
          </div>

          {/* Right: Scrollable Details Half - Exactly 50% width on LG */}
          <div className="p-8 lg:p-16 lg:py-24 space-y-12">
            {/* Title & Brand */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-600 flex items-center gap-3 mb-4">
                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.5)]" />
                 {product.brand}
              </p>
              <h1 className="text-3xl lg:text-5xl font-black text-zinc-900 tracking-tight leading-[1.05]">
                {product.name}
              </h1>
              
              {reviewCount > 0 && averageRating !== null && (
                <div className="mt-8 flex items-center gap-6">
                  <div className="flex items-center gap-1.5 bg-zinc-900 text-white px-4 py-1.5 rounded-full text-xs font-black">
                    <span className="text-amber-400 text-sm">★</span>
                    {averageRating.toFixed(1)}
                  </div>
                  <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase border-l border-zinc-200 pl-6">
                    {reviewCount} Reviews
                  </span>
                </div>
              )}
            </div>

            {/* Pricing Card - Feature Rich */}
            <div className="p-10 rounded-[48px] bg-zinc-900 text-white shadow-2xl shadow-zinc-200 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700" />
               <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-5xl font-black tracking-tighter">₹{product.price.toString()}</span>
                  {product.discountPercent && product.discountPercent > 0 && (
                    <span className="text-2xl text-zinc-500 line-through font-bold">
                       ₹{Math.round(Number(product.price) / (1 - product.discountPercent / 100)).toString()}
                    </span>
                  )}
               </div>
               
               {product.discountPercent && product.discountPercent > 0 && (
                 <div className="flex items-center gap-4 mt-6">
                    <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                       {product.discountPercent}% OFF
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-black uppercase tracking-widest">
                       Save ₹{Math.round(Number(product.price) * (product.discountPercent / 100))}
                    </div>
                 </div>
               )}
               <p className="mt-8 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Safe Payments · Genuine Products · Fast Delivery</p>
            </div>

            {/* Variant Cards - Premium Grid */}
            {variantOptions.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Available Packs</h3>
                  <div className="h-px bg-zinc-100 flex-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {variantOptions.map((v, idx) => (
                    <button
                      key={v}
                      type="button"
                      className={`relative flex flex-col items-start p-6 rounded-[32px] border-2 transition-all group overflow-hidden ${
                        idx === 0 
                          ? 'border-emerald-500 bg-emerald-50/30' 
                          : 'border-zinc-100 bg-white hover:border-emerald-300 hover:bg-zinc-50'
                      }`}
                    >
                      {idx === 0 && (
                        <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">Selected</span>
                      )}
                      <span className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-1">{v}</span>
                      <span className="text-xl font-black text-zinc-900">₹{product.price.toString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description - Clean Formatting */}
            <div className="pt-4 border-t border-zinc-100">
               <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Product Details</h3>
                  <div className="h-px bg-zinc-100 flex-1" />
               </div>
               <div className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line font-medium prose prose-zinc prose-sm max-w-none">
                 {product.description}
               </div>
            </div>

            {/* Actions - Always Visible for Desktop */}
            <div className="hidden lg:grid grid-cols-2 gap-4 pt-4">
              <form action={addToCartAction}>
                <button
                  type="submit"
                  className="w-full h-16 rounded-[24px] bg-zinc-100 text-zinc-900 text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 group"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Add to Cart
                </button>
              </form>
              <form action={addToCartAction}>
                <button
                  type="submit"
                  className="w-full h-16 rounded-[24px] bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all shadow-xl shadow-emerald-600/20 hover:shadow-zinc-900/20 flex items-center justify-center gap-3 group"
                >
                  Buy Now
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sticky Mobile ONLY Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-xl border-t border-zinc-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
           <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total</span>
                 <span className="text-xl font-black text-zinc-900">₹{product.price.toString()}</span>
              </div>
              <div className="flex-1 flex gap-3 max-w-xs ml-auto">
                 <form action={addToCartAction} className="flex-1">
                   <button
                     type="submit"
                     className="w-full h-12 rounded-xl bg-zinc-100 text-zinc-900 text-[10px] font-black uppercase tracking-widest"
                   >
                     Add
                   </button>
                 </form>
                 <form action={addToCartAction} className="flex-1">
                   <button
                     type="submit"
                     className="w-full h-12 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                   >
                     Buy Now
                   </button>
                 </form>
              </div>
           </div>
        </div>

        {/* Reviews */}
        <section className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-600">
                No reviews yet. Be the first to write one after you buy.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                          {r.rating}★
                        </span>
                        <span className="text-xs text-zinc-500">
                          {r.user.name ?? r.user.email}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-zinc-700">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900">
              Write a Review
            </h3>
            {!session ? (
              <p className="mt-2 text-xs text-zinc-600">
                Please{" "}
                <Link
                  href="/login"
                  className="font-medium text-emerald-600 hover:underline"
                >
                  login
                </Link>{" "}
                to write a review.
              </p>
            ) : (
              <form action={addReviewAction} className="mt-3 space-y-3">
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-xs font-medium text-zinc-700"
                  >
                    Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    required
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Select</option>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} ★
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="text"
                    className="block text-xs font-medium text-zinc-700"
                  >
                    Review
                  </label>
                  <textarea
                    id="text"
                    name="text"
                    rows={3}
                    required
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Share your experience with this product."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Submit Review
                </button>
                <p className="mt-1 text-[11px] text-zinc-500">
                  For now, any logged‑in customer can review. Later you can
                  restrict this to verified buyers only.
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

