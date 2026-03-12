import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getRoleStatus } from "@/lib/auth";
import { requestRetailerVerification } from "@/app/actions/auth";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function RetailerDashboardPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const status = getRoleStatus(session, "RETAILER");
  const { error } = await searchParams;

  // No role yet: show verification form
  if (!status) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">Retailer Verification</h1>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            Verification required
          </span>
        </div>
        <p className="mb-6 text-zinc-600">
          To access the Retailer dashboard, please submit your business details for verification.
        </p>
        {error && (
          <div
            className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}
        <form
          action={requestRetailerVerification}
          className="max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-zinc-700">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              id="shopName"
              name="shopName"
              type="text"
              required
              autoComplete="organization"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Your shop or store name"
            />
          </div>
          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-zinc-700">
              Owner Name <span className="text-red-500">*</span>
            </label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Proprietor / owner full name"
            />
          </div>
          <div>
            <label htmlFor="gstNumber" className="block text-sm font-medium text-zinc-700">
              GST Number <span className="text-red-500">*</span>
            </label>
            <input
              id="gstNumber"
              name="gstNumber"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="15-digit GSTIN"
            />
          </div>
          <div>
            <label htmlFor="shopAddress" className="block text-sm font-medium text-zinc-700">
              Shop Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="shopAddress"
              name="shopAddress"
              rows={3}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Full shop address"
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-zinc-700">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              required
              autoComplete="tel"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="10-digit mobile"
            />
          </div>
          <div>
            <label htmlFor="businessLicenseUrl" className="block text-sm font-medium text-zinc-700">
              Business License Upload URL (optional)
            </label>
            <input
              id="businessLicenseUrl"
              name="businessLicenseUrl"
              type="url"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="https://... (upload and paste link)"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Upload your business license to a cloud service and paste the URL here.
            </p>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Submit for verification
          </button>
        </form>
        <p className="mt-6 text-sm text-zinc-500">
          <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700">
            ← Switch role
          </Link>
        </p>
      </div>
    );
  }

  // PENDING: show verification in progress
  if (status === "PENDING") {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">Retailer Verification</h1>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            Verification in progress
          </span>
        </div>
        <p className="text-zinc-600">
          Your Retailer verification is under review. You will be notified once approved.
        </p>
        <p className="mt-6 text-sm text-zinc-500">
          <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700">
            ← Switch role
          </Link>
        </p>
      </div>
    );
  }

  // SUSPENDED
  if (status === "SUSPENDED") {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900">Retailer Account</h1>
          <span className="mt-2 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            Suspended
          </span>
        </div>
        <p className="text-zinc-600">
          Your Retailer account has been suspended. Please contact support.
        </p>
        <p className="mt-6 text-sm text-zinc-500">
          <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700">
            ← Switch role
          </Link>
        </p>
      </div>
    );
  }

  // APPROVED: show dashboard (e-commerce features + accessibility)
  const retailerSections = [
    { 
      title: "Storefront", 
      desc: "Browse the marketplace as a consumer.", 
      href: "/", 
      icon: "🛒", 
      color: "bg-emerald-50 text-emerald-600",
      ariaLabel: "Browse products" 
    },
    { 
      title: "Add Inventory", 
      desc: "List new farming inputs (requires admin approval).", 
      href: "/dashboard/products/new", 
      icon: "➕", 
      color: "bg-blue-50 text-blue-600",
      ariaLabel: "Add new products" 
    },
    { 
      title: "My Products", 
      desc: "Manage and update your active retail listings.", 
      href: "/dashboard/products", 
      icon: "🏪", 
      color: "bg-amber-50 text-amber-600",
      ariaLabel: "Manage your retailer products" 
    },
    { 
      title: "Sales Orders", 
      desc: "Track and fulfill customer orders.", 
      href: "#", 
      icon: "📋", 
      color: "bg-purple-50 text-purple-600",
      ariaLabel: "View orders" 
    },
  ];

  return (
    <div role="main" aria-label="Retailer dashboard" className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Retailer Dashboard</h1>
          <p className="mt-2 text-zinc-600 max-w-2xl">
            Welcome back! Manage your retail inventory. Sell farming inputs like seeds, 
            fertilizers, pesticides, tools, and machinery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3.5 py-1 text-sm font-bold text-blue-800 ring-1 ring-inset ring-blue-600/20">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            Retailer Account
          </span>
        </div>
      </div>

      <nav className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2" aria-label="Retailer dashboard quick links">
        {retailerSections.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            aria-label={card.ariaLabel}
            className="group relative flex items-start gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${card.color} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
              {card.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors uppercase tracking-wide text-sm mb-1">{card.title}</h2>
              <p className="text-sm text-zinc-500 leading-relaxed">{card.desc}</p>
              <div className="mt-4 flex items-center text-sm font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                Go to {card.title} <span className="ml-1">→</span>
              </div>
            </div>
            {card.href === "#" && (
              <span className="absolute top-4 right-4 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Coming Soon</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-12 rounded-2xl bg-zinc-900 p-8 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold">Business Support</h3>
          <p className="mt-2 text-zinc-300 text-sm max-w-md">Access resources and support to help scale your retail business on AgriBridge.</p>
          <Link href="/services" className="mt-4 inline-block rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20">
            View Partner Services
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
      </div>

      <p className="mt-10 text-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-emerald-600 transition-colors py-2 px-4 rounded-full border border-zinc-200 hover:border-emerald-200">
          <span>←</span> Switch your dashboard role
        </Link>
      </p>
    </div>
  );
}
