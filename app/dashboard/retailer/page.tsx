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
    { title: "Browse products", desc: "Same shopping experience as consumers.", href: "/", icon: "🛒", ariaLabel: "Browse products" },
    { title: "Add products", desc: "Create new input listings (go to admin for approval).", href: "/dashboard/products/new", icon: "➕", ariaLabel: "Add new products" },
    { title: "My products", desc: "Manage your existing listings.", href: "#", icon: "🏪", ariaLabel: "Manage your retailer products" },
    { title: "Orders", desc: "View and fulfill orders.", href: "#", icon: "📋", ariaLabel: "View orders" },
  ];

  return (
    <div role="main" aria-label="Retailer dashboard">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Retailer Dashboard</h1>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800" aria-hidden="true">
          Retailer
        </span>
      </div>
      <p className="text-zinc-600">
        Sell farming inputs only: seeds, fertilizers, pesticides, tools & machinery, irrigation. Add
        / edit / delete your products, view orders.
      </p>

      <nav className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Retailer dashboard quick links">
        {retailerSections.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            aria-label={card.ariaLabel}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <span className="text-2xl" aria-hidden="true">{card.icon}</span>
            <h2 className="mt-2 font-semibold text-zinc-900">{card.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{card.desc}</p>
          </Link>
        ))}
      </nav>

      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded">
          ← Switch role
        </Link>
      </p>
    </div>
  );
}
