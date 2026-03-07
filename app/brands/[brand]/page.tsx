import Link from "next/link";
import { ProductCard } from "@/app/components/ProductCard";
import { BRANDS } from "@/app/data";
import { formatLabelFromSlug } from "@/app/config/catalog";
import { prisma } from "@/lib/prisma";
import { productToUiProduct } from "@/app/lib/productUi";
import { getSession } from "@/lib/auth";

type Props = {
  params: Promise<{ brand: string }>;
};

export default async function BrandPage({ params }: Props) {
  const { brand } = await params;
  const brandLabel = formatLabelFromSlug(brand);
  const brandMeta = BRANDS.find((b) => b.slug === brand);
  const session = await getSession();
  const isLoggedIn = !!session;

  const rows = await prisma.product.findMany({
    where: {
      status: "APPROVED",
      brand: { equals: brandLabel, mode: "insensitive" },
    },
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });

  const results = rows.map((p) => productToUiProduct(p));

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {brandMeta && (
              <div className="h-12 w-24 rounded-lg border border-zinc-200 bg-white p-2">
                <img
                  src={brandMeta.logo}
                  alt={`${brandMeta.name} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                {brandMeta?.name ?? brandLabel}
              </h1>
              <p className="mt-1 text-sm text-zinc-600">
                {results.length > 0
                  ? `${results.length} product${results.length === 1 ? "" : "s"} available`
                  : "Products for this brand will appear here once you add them."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/brands"
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              ← All Brands
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              Home
            </Link>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            No products added for <span className="font-semibold">{brandLabel}</span>{" "}
            yet.
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
    </div>
  );
}

