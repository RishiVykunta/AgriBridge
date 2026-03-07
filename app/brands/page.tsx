import Link from "next/link";
import { BRANDS } from "../data";

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              Brands
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Browse products by brand.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {BRANDS.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex h-20 items-center justify-center">
                <img
                  src={b.logo}
                  alt={`${b.name} logo`}
                  className="h-full w-auto object-contain transition group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-3 text-center text-sm font-semibold text-zinc-900">
                {b.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

