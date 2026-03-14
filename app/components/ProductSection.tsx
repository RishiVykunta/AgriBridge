import Link from "next/link";
import { ProductCard } from "./ProductCard";

export type Product = {
  /** Optional DB id. When present, enables cart/wishlist and product details navigation. */
  productId?: string;
  name: string;
  brand: string;
  prices: {
    label: string;
    price: string;
  }[];
  cutPrice?: string;
  save?: string;
  discount?: string;
  image?: string;
  images?: string[];
  availability?: "in_stock" | "out_of_stock";
  description?: string;
  /** Optional product details href. Defaults to "#" */
  href?: string;
};

type ProductSectionProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  /** Whether current user is logged in (controls ProductCard actions) */
  isLoggedIn?: boolean;
};

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref = "#",
  isLoggedIn,
}: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-zinc-500">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={viewAllHref}
            className="text-sm font-medium text-emerald-600"
          >
            View All
          </Link>
        </div>

        <div className="mt-6 flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {products.map((p) => (
            <div key={p.productId ?? p.name} className="snap-start shrink-0">
              <ProductCard
                name={p.name}
                brand={p.brand}
                prices={p.prices}
                cutPrice={p.cutPrice}
                save={p.save}
                discount={p.discount}
                image={p.image}
                images={p.images}
                availability={p.availability}
                description={p.description}
                href={p.href}
                productId={p.productId}
                isLoggedIn={isLoggedIn}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}