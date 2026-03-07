import { HomeHeaderServer } from "./components/HomeHeaderServer";
import { HeroSlider } from "./components/HeroSlider";
import { CategoriesSection } from "./components/CategoriesSection";
import ProductSection from "./components/ProductSection";
import { HomeFooter } from "./components/HomeFooter";
import Link from "next/link";
import { BRANDS, GROWTH_PROMOTERS, NEW_ARRIVALS, SEEDS, TODAYS_OFFERS, TRENDING_PRODUCTS } from "./data";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productToUiProduct } from "@/app/lib/productUi";

export default async function Home() {
  const session = await getSession();
  const isLoggedIn = !!session;

  const db = prisma as any;

  const [
    todaysOffersRows,
    newArrivalsRows,
    growthPromotersRows,
    seedsRows,
    trendingRows,
  ] = await Promise.all([
    // Today's offers: explicitly marked as today offers
    db.product.findMany({
      where: { status: "APPROVED", isTodayOffer: true },
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    // New arrivals: explicitly marked
    db.product.findMany({
      where: { status: "APPROVED", isNewArrival: true },
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    // Growth promoters: crop nutrition → growth promoter subcategories
    db.product.findMany({
      where: {
        status: "APPROVED",
        mainCategory: "CROP_NUTRITION",
        subCategory: {
          in: [
            "Plant Growth Promoters",
            "Plant Enhancers",
            "Bio Stimulants/Activators",
          ],
        },
      },
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    // Seeds section: seeds main category
    db.product.findMany({
      where: { status: "APPROVED", mainCategory: "SEEDS" },
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    // Trending: explicitly marked
    db.product.findMany({
      where: { status: "APPROVED", isTrending: true },
      include: { media: true },
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 12,
    }),
  ]);

  const todaysOffersDb = todaysOffersRows.map((p: any) => productToUiProduct(p));
  const newArrivalsDb = newArrivalsRows.map((p: any) => productToUiProduct(p));
  const growthPromotersDb = growthPromotersRows.map((p: any) =>
    productToUiProduct(p)
  );
  const seedsDb = seedsRows.map((p: any) => productToUiProduct(p));
  const trendingDb = trendingRows.map((p: any) => productToUiProduct(p));

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <HomeHeaderServer />
      <HeroSlider />
      <CategoriesSection />

      {/* ✅ Today's Offers */}
      <section id="todays-offers-section">
        <ProductSection
          title="Today's Offers"
          subtitle="Best prices available today"
          products={todaysOffersDb}
          viewAllHref="/todays-offers"
          isLoggedIn={isLoggedIn}
        />
      </section>

      {/* 🔥 Promo Bar */}
      <div className="relative overflow-hidden bg-emerald-600 text-white py-3">
        <div className="flex whitespace-nowrap animate-marquee gap-10 text-sm font-medium tracking-wide px-4">
          <span>🌱 Get ₹100 OFF on Your First App Order</span>
          <span>🚚 Free Delivery on Orders Above ₹499</span>
          <span>💳 Secure Payments & Fast Checkout</span>
          <span>🌾 Premium Quality Seeds & Fertilizers</span>
          <span>🔥 Limited Time Offers Available Now</span>

          {/* Duplicate for infinite loop */}
          <span>🌱 Get ₹100 OFF on Your First App Order</span>
          <span>🚚 Free Delivery on Orders Above ₹499</span>
          <span>💳 Secure Payments & Fast Checkout</span>
          <span>🌾 Premium Quality Seeds & Fertilizers</span>
          <span>🔥 Limited Time Offers Available Now</span>
        </div>
      </div>

      {/* ✅ New Arrivals */}
      <section id="new-arrivals-section">
        <ProductSection
          title="New Arrivals"
          subtitle="Recently added products"
          products={newArrivalsDb}
          viewAllHref="/new-arrivals"
          isLoggedIn={isLoggedIn}
        />
      </section>

      {/* ✅ Growth Promoters */}
      <section id="growth-promoters-section">
        <ProductSection
          title="Growth Promoters ✨"
          subtitle="Boost crop growth naturally"
          products={growthPromotersDb}
          viewAllHref="/growth-promoters"
          isLoggedIn={isLoggedIn}
        />
      </section>

      {/* ================= FEATURED BRANDS ================= */}
<section
  id="brands-section"
  className="bg-emerald-100 py-16 overflow-hidden"
>
  {/* Header with See All */}
  <div className="flex items-center justify-between mb-12 px-6 max-w-7xl mx-auto">
    <div>
      <h2 className="text-3xl font-bold text-zinc-800">
        Featured Brands
      </h2>
      <p className="text-zinc-600 mt-1 text-sm">
        Trusted agricultural brands
      </p>
    </div>

    <Link
      href="/brands"
      className="text-emerald-700 font-semibold text-sm hover:underline"
    >
      See All →
    </Link>
  </div>

  {/* Full Width Marquee */}
  <div className="relative w-full overflow-hidden">
    <div className="flex w-max animate-marquee gap-25 hover:[animation-play-state:paused]">
      
      {[...BRANDS, ...BRANDS].map((b, index) => (
        <Link
          key={`${b.slug}::${index}`}
          href={`/brands/${b.slug}`}
          className="flex h-24 shrink-0 items-center justify-center transition-transform duration-300 hover:scale-110"
        >
          <img
            src={b.logo}
            alt={`${b.name} logo`}
            className="h-full w-auto object-contain"
          />
        </Link>
      ))}

    </div>
  </div>
</section>

      <section id="seeds-section">
        <ProductSection
          title="Seeds"
          subtitle="Quality Seeds, Proven Results"
          products={seedsDb}
          viewAllHref="/seeds"
          isLoggedIn={isLoggedIn}
        />
      </section>

{/* ✅ Trending Products Section */}
<ProductSection
  title="Trending Products 🔥"
  subtitle="Farmer favorites this week."
  products={trendingDb}
  viewAllHref="/trending-products"
  isLoggedIn={isLoggedIn}
/>

      <HomeFooter />
    </div>
  );
}