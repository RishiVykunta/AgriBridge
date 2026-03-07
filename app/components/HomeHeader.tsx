"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Heart, User, ShoppingCart, Truck, Bell } from "lucide-react";
import {
  CATEGORY_BASE_PATH,
  DEFAULT_PARENT_LINK,
  getCategoryHref,
  MEGA_MENU_CONFIG,
  NAV_ITEMS,
  SAVINGS_ACCOUNT_URL,
  SECTION_IDS,
} from "@/app/config/catalog";
import { logout } from "@/app/actions/auth";

type HeaderSession = {
  email: string;
  name?: string | null;
  isAdmin?: boolean;
  pendingRoleRequests?: number;
  cartCount?: number;
  wishlistCount?: number;
} | null;

type HomeHeaderProps = {
  session?: HeaderSession;
};

export function HomeHeader({ session }: HomeHeaderProps) {
  const router = useRouter();
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const isLoggedIn = !!session;
  const isAdmin = !!session?.isAdmin;
  const pendingRoleRequests = session?.pendingRoleRequests ?? 0;
  const [cartCount, setCartCount] = useState<number>(session?.cartCount ?? 0);
  const [wishlistCount, setWishlistCount] = useState<number>(
    session?.wishlistCount ?? 0
  );

  // Keep local counts in sync with server-provided values on initial render / refresh
  useEffect(() => {
    setCartCount(session?.cartCount ?? 0);
    setWishlistCount(session?.wishlistCount ?? 0);
  }, [session?.cartCount, session?.wishlistCount]);

  // Listen for cart updates dispatched from product cards
  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as CustomEvent<{ count: number }>;
      if (typeof e.detail?.count === "number") {
        setCartCount(e.detail.count);
      }
    };
    window.addEventListener("agribridge:cart-updated", handler as EventListener);
    return () =>
      window.removeEventListener(
        "agribridge:cart-updated",
        handler as EventListener
      );
  }, []);

  // Listen for wishlist updates dispatched from product cards
  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as CustomEvent<{ count: number }>;
      if (typeof e.detail?.count === "number") {
        setWishlistCount(e.detail.count);
      }
    };
    window.addEventListener(
      "agribridge:wishlist-updated",
      handler as EventListener
    );
    return () =>
      window.removeEventListener(
        "agribridge:wishlist-updated",
        handler as EventListener
      );
  }, []);

  const handleNavClick = (item: string) => {
    const sectionId = SECTION_IDS[item];
    if (!sectionId) return;

    if (typeof window === "undefined" || typeof document === "undefined") return;

    const el = document.getElementById(sectionId);
    if (!el) return;

    // Adjust for sticky header so section title is not hidden
    const headerOffset = 96; // tweak this value if needed
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - headerOffset;

    window.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  };

  const handleMegaMenuItemClick = (parent: string, entry: string) => {
    if (parent === "Services" && entry === "Open Savings Account") {
      window.open(SAVINGS_ACCOUNT_URL, "_blank", "noopener,noreferrer");
      setOpenMegaMenu(null);
      return;
    }

    // Services routes are fixed pages, not category listings
    if (parent === "Services") {
      if (entry === "Tractor Loan") router.push("/services/tractor-loan");
      if (entry === "Harvester Loan") router.push("/services/harvester-loan");
      setOpenMegaMenu(null);
      return;
    }

    router.push(getCategoryHref(parent, entry));
    setOpenMegaMenu(null);
  };

  return (
    <>
      {/* ================= TOP DARK BAR ================= */}
      <div className="bg-emerald-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div></div>

          <div className="flex items-center gap-6">
            <Link href="/signup" className="hover:underline">
              Sell on AgriBridge
            </Link>
            <Link href="#" className="hover:underline">
              Bulk Order Enquiries
            </Link>
            <Link href="#" className="hover:underline">
              Corporate Site
            </Link>

            {/* Highlight Button */}
            <div className="bg-orange-500 text-white px-4 py-1.5 rounded-md font-medium">
              Missed Call To Order: +91 6300189945
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-bold text-emerald-700 tracking-tight"
          >
            AgriBridge
          </Link>

          {/* Search */}
          <div className="flex-1 flex justify-center">
            <form
              className="w-full max-w-xl flex"
              onSubmit={(e) => {
                e.preventDefault();
                const q = query.trim();
                if (!q) return;
                router.push(`/search?q=${encodeURIComponent(q)}`);
              }}
            >
              <input
                type="search"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="submit"
                className="bg-orange-500 px-4 flex items-center justify-center rounded-r-md hover:bg-orange-600 transition"
              >
                <Search className="text-white w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6 text-sm text-gray-700">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="flex items-center gap-1 hover:text-emerald-600 transition"
            >
              <Truck size={18} />
              Track Order
            </Link>

            {/* Wishlist quick link */}
            <Link
              href={isLoggedIn ? "/wishlist" : "/login"}
              className="relative flex items-center gap-1 hover:text-emerald-600 transition"
            >
              <Heart size={18} />
              Wishlist
              {wishlistCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <>
                {/* Admin notification bell */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/admin/roles")}
                    className="relative flex items-center justify-center rounded-full border border-zinc-300 p-2 text-zinc-700 hover:border-amber-500 hover:text-amber-700"
                    aria-label="Role requests"
                  >
                    <Bell size={16} />
                    {pendingRoleRequests > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                        {pendingRoleRequests}
                      </span>
                    )}
                  </button>
                )}

                {/* Account / Switch role for non-admins only */}
                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-emerald-500 hover:text-emerald-700"
                  >
                    <User size={16} />
                    <span>Account / Switch role</span>
                  </button>
                )}

                <div className="hidden sm:flex flex-col items-end text-xs text-zinc-700">
                  <span className="font-medium">
                    {session?.name || session?.email}
                  </span>
                  <span className="text-zinc-400">
                    {isAdmin ? "Admin" : "Logged in"}
                  </span>
                </div>

                {/* Logout */}
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 hover:text-emerald-600 transition"
              >
                <User size={18} />
                Login
              </Link>
            )}

            <Link
              href={isLoggedIn ? "/cart" : "/login"}
              className="relative flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
            >
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/90 px-1 text-[11px] font-semibold text-emerald-700">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ================= NAVIGATION + MEGA MENU ================= */}
        <nav className="border-t bg-gray-50">
          <div
            className="max-w-7xl mx-auto px-6 relative"
            onMouseLeave={() => setOpenMegaMenu(null)}
          >
            <ul className="flex items-center justify-center gap-8 py-3 text-sm font-medium text-gray-700">
              {NAV_ITEMS.map((item) => {
                const hasMegaMenu = Boolean(MEGA_MENU_CONFIG[item]);

                return (
                  <li key={item}>
                    {hasMegaMenu ? (
                      <button
                        type="button"
                        onMouseEnter={() => setOpenMegaMenu(item)}
                        onFocus={() => setOpenMegaMenu(item)}
                        onClick={() => {
                          const landing = DEFAULT_PARENT_LINK[item];
                          if (landing) {
                            router.push(landing);
                            setOpenMegaMenu(null);
                            return;
                          }
                          handleNavClick(item);
                        }}
                        className={`px-3 py-1.5 rounded-sm transition-colors ${
                          openMegaMenu === item
                            ? "bg-emerald-500 text-white"
                            : "hover:text-emerald-600"
                        }`}
                      >
                        {item}
                      </button>
                    ) : (
                      <Link
                        href="#"
                        onClick={() => handleNavClick(item)}
                        className="hover:text-emerald-600 transition-colors"
                      >
                        {item}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Generic mega menu for configured items */}
            {openMegaMenu && MEGA_MENU_CONFIG[openMegaMenu] && (
              <div
                className="absolute left-1/2 z-40 mt-1 w-[900px] -translate-x-1/2 rounded-b-md border border-t-0 border-emerald-200 bg-white px-10 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
                  {MEGA_MENU_CONFIG[openMegaMenu].map((col) => (
                    <div key={col.title}>
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600 mb-3">
                        {col.title}
                      </h3>
                      <ul className="space-y-1.5 text-[13px] text-zinc-700">
                        {col.items.map((entry) => (
                          <li
                            key={entry}
                            className="border-b border-zinc-100 last:border-b-0 pb-1.5 last:pb-0"
                          >
                            <button
                              type="button"
                              className="w-full text-left hover:text-emerald-600"
                              onClick={() =>
                                handleMegaMenuItemClick(openMegaMenu, entry)
                              }
                            >
                              {entry}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}