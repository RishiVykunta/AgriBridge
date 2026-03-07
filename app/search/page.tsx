import Link from "next/link";
import { ProductCard } from "../components/ProductCard";
import { prisma } from "@/lib/prisma";
import { productToUiProduct } from "@/app/lib/productUi";
import { getSession } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const session = await getSession();
  const isLoggedIn = !!session;

  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();

  const rows =
    q.length === 0
      ? []
      : await prisma.product.findMany({
          where: {
            status: "APPROVED",
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { brand: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
          include: { media: true },
          orderBy: { createdAt: "desc" },
          take: 48,
        });

  const results = rows.map((p) => productToUiProduct(p));

  return (
    <div id="top" className="relative min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              Search
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              {q ? (
                <>
                  Showing {results.length} result{results.length === 1 ? "" : "s"} for{" "}
                  <span className="font-semibold text-zinc-900">“{q}”</span>
                </>
              ) : (
                "Type a keyword in the search bar to find products."
              )}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {q && results.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            No products matched <span className="font-semibold">“{q}”</span>.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => (
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
        )}
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

