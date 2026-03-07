import Link from "next/link";
import { ProductCard } from "../components/ProductCard";
import { prisma } from "@/lib/prisma";
import { productToUiProduct } from "@/app/lib/productUi";
import { getSession } from "@/lib/auth";

export default async function TrendingProductsPage() {
  const session = await getSession();
  const isLoggedIn = !!session;
  const rows = await prisma.product.findMany({
    where: { status: "APPROVED", isTrending: true },
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });
  const products = rows.map((p) => productToUiProduct(p));
  return (
    <div id="top" className="relative min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              Trending Products
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Farmer favorites this week.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.productId ?? p.name}
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

      <a
        href="#top"
        className="fixed bottom-6 right-6 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Go to Top ↑
      </a>
    </div>
  );
}

