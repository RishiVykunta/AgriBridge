import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { Product as UiProduct } from "./ProductSection";

type Props = {
  sectionLabel: string;
  categoryLabel: string;
  categories: { label: string; href: string }[];
  /** Optional: products to show in the grid on the right */
  products?: UiProduct[];
  /** Whether the current user is logged in (for ProductCard actions) */
  isLoggedIn?: boolean;
  /** Optional list of brand names to show in the Brands filter */
  brands?: string[];
};

export function CategoryListingLayout({
  sectionLabel,
  categoryLabel,
  categories,
  products,
  isLoggedIn,
  brands,
}: Props) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              {sectionLabel}
            </p>
            <h1 className="text-2xl font-semibold text-zinc-900">
              {categoryLabel}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-600">Sort By :</span>
            <select className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <option>Best Selling</option>
              <option>Customer Rating: 4★ and above</option>
              <option>Price: Low to High</option>
              <option>Price: High to low</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          {/* Filters */}
          <aside className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
            <h2 className="text-base font-semibold text-zinc-900">Filters</h2>

            {/* Categories */}
            <section className="border-t border-zinc-100 pt-3">
              <button className="flex w-full items-center justify-between text-left font-medium text-zinc-800">
                <span>Categories</span>
                <span className="text-xs text-zinc-500">▼</span>
              </button>
              <div className="mt-2 max-h-56 overflow-auto pr-1">
                <ul className="space-y-1.5 text-xs text-zinc-700">
                  {categories.map((c) => (
                    <li
                      key={`${c.href}::${c.label}`}
                      className="border-b border-zinc-100 last:border-b-0 pb-1.5 last:pb-0"
                    >
                      <Link href={c.href} className="block hover:text-emerald-600">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Brands */}
            <section className="border-t border-zinc-100 pt-3">
              <button className="flex w-full items-center justify-between text-left font-medium text-zinc-800">
                <span>Brands</span>
                <span className="text-xs text-zinc-500">▼</span>
              </button>
              <input
                type="text"
                placeholder="Search Brands"
                className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {brands && brands.length > 0 ? (
                <div className="mt-2 max-h-40 overflow-auto pr-1">
                  <ul className="space-y-1.5 text-xs text-zinc-700">
                    {brands.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-3 w-3 rounded border-zinc-300"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-2 text-xs text-zinc-400">No brands found</p>
              )}
            </section>

            {/* Price */}
            <section className="border-t border-zinc-100 pt-3">
              <button className="flex w-full items-center justify-between text-left font-medium text-zinc-800">
                <span>Price</span>
                <span className="text-xs text-zinc-500">▼</span>
              </button>
              <div className="mt-3">
                <div className="relative h-1 rounded-full bg-zinc-200">
                  <div className="absolute inset-y-0 left-1/4 right-1/3 rounded-full bg-emerald-500" />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                  <select className="w-1/2 rounded-md border border-zinc-300 px-2 py-1 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>₹0</option>
                    <option>₹100</option>
                    <option>₹500</option>
                    <option>₹1000</option>
                  </select>
                  <span className="text-zinc-500">To</span>
                  <select className="w-1/2 rounded-md border border-zinc-300 px-2 py-1 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>₹20000</option>
                    <option>₹10000</option>
                    <option>₹5000</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Rating */}
            <section className="border-t border-zinc-100 pt-3">
              <button className="flex w-full items-center justify-between text-left font-medium text-zinc-800">
                <span>Rating</span>
                <span className="text-xs text-zinc-500">▼</span>
              </button>
              <div className="mt-2 space-y-1.5 text-xs text-zinc-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-3 w-3 rounded border-zinc-300" />
                  <span>
                    4 ★ <span className="text-zinc-500">And Above</span>
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-3 w-3 rounded border-zinc-300" />
                  <span>
                    3 ★ <span className="text-zinc-500">And Above</span>
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-3 w-3 rounded border-zinc-300" />
                  <span>
                    2 ★ <span className="text-zinc-500">And Above</span>
                  </span>
                </label>
              </div>
            </section>

            {/* Availability */}
            <section className="border-t border-zinc-100 pt-3">
              <button className="flex w-full items-center justify-between text-left font-medium text-zinc-800">
                <span>Availability</span>
                <span className="text-xs text-zinc-500">▼</span>
              </button>
              <div className="mt-2 space-y-1.5 text-xs text-zinc-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-3 w-3 rounded border-zinc-300" />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-3 w-3 rounded border-zinc-300" />
                  <span>Out of Stock</span>
                </label>
              </div>
            </section>
          </aside>

          {/* Product grid */}
          <main>
            {products && products.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-zinc-500">
                  Showing{" "}
                  <span className="font-semibold text-zinc-800">
                    {products.length}
                  </span>{" "}
                  products
                </p>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            ) : (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                <p>
                  Products for{" "}
                  <span className="font-semibold">{categoryLabel}</span> will
                  appear here. Once you add items through the admin, farmer, or
                  retailer accounts, they will be listed in this area.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

