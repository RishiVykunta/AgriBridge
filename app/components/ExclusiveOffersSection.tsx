import Link from "next/link";

const BANNERS = [
  { id: 1, title: "Seeds & Planting", href: "#" },
  { id: 2, title: "Crop Protection", href: "#" },
  { id: 3, title: "Farm Equipment", href: "#" },
];

export function ExclusiveOffersSection() {
  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-8 sm:px-6" aria-labelledby="exclusive-heading">
      <h2 id="exclusive-heading" className="sr-only">
        Exclusive offers
      </h2>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 md:grid-cols-3">
          {BANNERS.map((b) => (
            <Link
              key={b.id}
              href={b.href}
              className="flex aspect-[2/1] items-center justify-center rounded-xl bg-zinc-200 text-zinc-600 transition hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <span className="font-medium">{b.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
