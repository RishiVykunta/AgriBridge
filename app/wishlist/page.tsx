import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productToUiProduct } from "@/app/lib/productUi";
import { ProductCard } from "@/app/components/ProductCard";

export default async function WishlistPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">Wishlist</h1>
          <p className="text-sm text-zinc-600">
            Please{" "}
            <Link href="/login" className="text-emerald-600 font-medium">
              log in
            </Link>{" "}
            to view your wishlist.
          </p>
        </div>
      </div>
    );
  }

  const rows = await prisma.wishlistItem.findMany({
    where: { userId: session.userId },
    include: {
      product: {
        include: { media: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (rows.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">Wishlist</h1>
          <p className="text-sm text-zinc-600">
            Your wishlist is currently empty.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const isLoggedIn = true;
  const products = rows.map((row) => productToUiProduct(row.product));

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              Wishlist
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Products you have added to your wishlist.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.productId ?? `${p.name}::${p.brand}`}
              name={p.name}
              brand={p.brand}
              prices={p.prices}
              cutPrice={p.cutPrice}
              save={p.save}
              discount={p.discount}
              image={p.image}
              availability={p.availability}
              description={p.description}
              href={p.href}
              productId={p.productId}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

