import Link from "next/link";

const PROMOS = [
  { label: "Get ₹100 off on first order", href: "#", highlight: "App offer" },
  { label: "Free delivery on orders above ₹499", href: "#", highlight: "Free delivery" },
  { label: "Use code WELCOME20 for 20% off", href: "#", highlight: "Coupon" },
];

export function PromoBannerStrip() {
  return (
    <section className="bg-emerald-600 py-3 text-white overflow-hidden">
      <div className="relative w-full overflow-hidden">
        
        {/* Moving wrapper */}
        <div className="flex w-max animate-promo hover:[animation-play-state:paused]">
          
          {[...PROMOS, ...PROMOS].map((promo, index) => (
            <Link
              key={index}
              href={promo.href}
              className="flex items-center gap-3 whitespace-nowrap px-8"
            >
              <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-semibold">
                {promo.highlight}
              </span>
              <span className="font-medium">
                {promo.label}
              </span>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}