import Link from "next/link";

const BRANDS = [
  "Syngenta",
  "Bayer",
  "VNR",
  "Rallis",
  "UPL",
  "Dhanuka",
  "Nagarjuna",
  "Coromandel",
];

export function BrandsSection() {
  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-8 sm:px-6" aria-labelledby="brands-heading">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="brands-heading" className="text-xl font-semibold text-zinc-900">
            Brands
          </h2>
          <Link
            href="#"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
          >
            View All
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              href="#"
              className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-6 font-medium text-zinc-700 shadow-sm transition hover:border-emerald-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
