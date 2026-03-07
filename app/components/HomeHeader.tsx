"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Heart, User, ShoppingCart, Truck, Bell, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="bg-emerald-800 text-white text-sm hidden sm:block">
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

      {/* Mobile Dark Bar (Call only) */}
      <div className="bg-orange-500 text-white text-xs sm:hidden text-center py-2 font-medium">
        Missed Call To Order: +91 6300189945
      </div>

      {/* ================= MAIN HEADER ================= */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          
          {/* Top Row: Logo & Actions + Mobile Menu Toggle */}
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            
            {/* Mobile Nav Toggle */}
            <button
              type="button"
              className="sm:hidden text-emerald-700"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold text-emerald-700 tracking-tight"
            >
              AgriBridge
            </Link>

            {/* Search (Desktop Only inline) */}
            <div className="hidden sm:flex flex-1 justify-center">
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
                <button
                  type="submit"
                  className="bg-orange-500 px-4 flex items-center justify-center rounded-r-md hover:bg-orange-600 transition"
                >
                  <Search className="text-white w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-6 text-sm text-gray-700">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="hidden md:flex items-center gap-1 hover:text-emerald-600 transition"
              >
                <Truck size={18} />
                Track Order
              </Link>

              {/* Wishlist quick link */}
              <Link
                href={isLoggedIn ? "/wishlist" : "/login"}
                className="relative hidden md:flex items-center gap-1 hover:text-emerald-600 transition"
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
                      className="relative hidden sm:flex items-center justify-center rounded-full border border-zinc-300 p-2 text-zinc-700 hover:border-amber-500 hover:text-amber-700"
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
                      className="hidden sm:flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-emerald-500 hover:text-emerald-700"
                    >
                      <User size={16} />
                      <span>Account</span>
                    </button>
                  )}

                  <div className="hidden lg:flex flex-col items-end text-xs text-zinc-700">
                    <span className="font-medium">
                      {session?.name || session?.email}
                    </span>
                    <span className="text-zinc-400">
                      {isAdmin ? "Admin" : "Logged in"}
                    </span>
                  </div>

                  {/* Logout */}
                  <form action={logout} className="hidden sm:block">
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
                  className="hidden sm:flex items-center gap-1 hover:text-emerald-600 transition"
                >
                  <User size={18} />
                  Login
                </Link>
              )}

              {/* Profile Icon for Mobile */}
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="sm:hidden text-zinc-700"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <Link
                href={isLoggedIn ? "/cart" : "/login"}
                className="relative flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-emerald-700 transition"
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:block">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/90 px-1 text-[11px] font-semibold text-emerald-700">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search Bar - Mobile Only (Stacked below header) */}
          <div className="mt-3 sm:hidden">
            <form
              className="w-full flex"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
              <button
                type="submit"
                className="bg-orange-500 px-3 flex items-center justify-center rounded-r-md hover:bg-orange-600 transition"
              >
                <Search className="text-white w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ================= DESKTOP NAVIGATION + MEGA MENU ================= */}
        <nav className="border-t bg-gray-50 hidden sm:block">
          <div
            className="max-w-7xl mx-auto px-6 relative"
            onMouseLeave={() => setOpenMegaMenu(null)}
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 text-sm font-medium text-gray-700">
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
                className="absolute left-1/2 z-40 mt-1 w-[95%] max-w-[900px] -translate-x-1/2 rounded-b-md border border-t-0 border-emerald-200 bg-white px-6 sm:px-10 py-6 sm:py-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-sm">
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

      {/* ================= MOBILE NAV DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex sm:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative flex w-4/5 max-w-sm flex-col bg-white shadow-xl h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-xl font-bold text-emerald-700">Menu</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-zinc-500 hover:text-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-4">
              <div className="space-y-1 border-b pb-4">
                <Link 
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  className="block px-3 py-2 rounded-md hover:bg-zinc-50 text-base font-medium text-zinc-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link 
                  href={isLoggedIn ? "/wishlist" : "/login"}
                  className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-zinc-50 text-base font-medium text-zinc-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-semibold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                {isLoggedIn && (
                  <form action={logout}>
                    <button
                      type="submit"
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-50 text-base font-medium text-red-600"
                    >
                      Logout
                    </button>
                  </form>
                )}
              </div>

              <div className="pt-2">
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Categories
                </h3>
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => {
                          const landing = DEFAULT_PARENT_LINK[item];
                          if (landing) {
                            router.push(landing);
                          } else {
                            handleNavClick(item);
                          }
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md hover:bg-zinc-50 text-base font-medium text-zinc-900"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
            
            <div className="p-4 bg-zinc-50 border-t">
              <Link href="/signup" className="block w-full text-center text-sm font-medium text-emerald-700 hover:underline">
                Sell on AgriBridge
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}