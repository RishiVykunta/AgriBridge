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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Breadcrumb + Back */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-xs text-zinc-500">
            <Link href="/" className="hover:text-emerald-600">
              Home
            </Link>{" "}
            / <span>Product</span>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 items-start">
          {/* Left: media gallery */}
          <div>
            <ProductGallery name={product.name} media={product.media as any} />
          </div>

          {/* Right: details */}
          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                {product.brand}
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center flex-wrap gap-3">
              <p className="text-2xl font-semibold text-zinc-900">
                ₹{product.price.toString()}
              </p>
              {product.discountPercent && product.discountPercent > 0 && (
                <>
                  <span className="text-sm text-zinc-400 line-through">
                    ₹
                    {Math.round(
                      Number(product.price) /
                        (1 - product.discountPercent / 100)
                    ).toString()}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {product.discountPercent}% OFF
                  </span>
                </>
              )}
              {reviewCount > 0 && averageRating !== null && (
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span>★ {averageRating.toFixed(1)}</span>
                  <span className="text-zinc-400">({reviewCount})</span>
                </div>
              )}
            </div>

            {/* Stock status */}
            <p className="text-xs">
              {product.stock > 0 ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
                  Out of Stock
                </span>
              )}
            </p>

            {/* Variant selector */}
            {variantOptions.length > 0 && (
              <div className="pt-1">
                <p className="text-xs font-medium text-zinc-700 mb-1">
                  Variant
                </p>
                <div className="flex flex-wrap gap-2">
                  {variantOptions.map((v) => (
                    <button
                      key={v}
                      type="button"
                      className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:border-emerald-500 hover:text-emerald-700"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-zinc-700 leading-relaxed">
              {product.description}
            </p>

            <p className="text-xs text-zinc-500">
              Category: {product.mainCategory} · {product.subCategory}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-100">
              <form action={addToCartAction}>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Add to Cart
                </button>
              </form>
              <form action={addToCartAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-emerald-600 px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Buy Now
                </button>
              </form>
              <form action={addToWishlistAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:border-emerald-300 hover:text-emerald-700"
                >
                  ♥ Add to Wishlist
                </button>
              </form>
              {!session && (
                <p className="text-xs text-zinc-500">
                  Login to buy, add to cart, or wishlist. You will be redirected
                  if not logged in.
                </p>
              )}
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

