import Link from "next/link";

const NUTRIENTS = [
  { label: "Plant Growth", href: "#", icon: "🌿" },
  { label: "Root Growth", href: "#", icon: "🥔" },
  { label: "Color and Size", href: "#", icon: "🎨" },
  { label: "Flowers and Fruits", href: "#", icon: "🍎" },
  { label: "Greener Leaves", href: "#", icon: "🍃" },
  { label: "Nutrient Deficiencies", href: "#", icon: "💊" },
];

export function ShopByNutrientsSection() {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-8 sm:px-6" aria-labelledby="nutrients-heading">
      <h2 id="nutrients-heading" className="mb-6 text-xl font-semibold text-zinc-900">
        Shop by Nutrients
      </h2>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {NUTRIENTS.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl"
                aria-hidden="true"
              >
                {n.icon}
              </span>
              <span className="mt-2 text-center text-xs font-medium text-zinc-700">
                {n.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
