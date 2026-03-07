import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getRoleStatus } from "@/lib/auth";
import { requestFarmerVerification } from "@/app/actions/auth";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function FarmerDashboardPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const status = getRoleStatus(session, "FARMER");
  const { error } = await searchParams;

  // No role yet: show verification form
  if (!status) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">Farmer Verification</h1>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            Verification required
          </span>
        </div>
        <p className="mb-6 text-zinc-600">
          To access the Farmer dashboard, please submit your business details for verification.
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
          action={requestFarmerVerification}
          className="max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-zinc-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              autoComplete="tel"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="10-digit mobile"
            />
          </div>
          <div>
            <label htmlFor="aadhaar" className="block text-sm font-medium text-zinc-700">
              Aadhaar / Govt ID <span className="text-red-500">*</span>
            </label>
            <input
              id="aadhaar"
              name="aadhaar"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="12-digit Aadhaar number"
            />
          </div>
          <div>
            <label htmlFor="farmLocation" className="block text-sm font-medium text-zinc-700">
              Farm Location <span className="text-red-500">*</span>
            </label>
            <textarea
              id="farmLocation"
              name="farmLocation"
              rows={2}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Village, District, State"
            />
          </div>
          <div>
            <label htmlFor="landArea" className="block text-sm font-medium text-zinc-700">
              Land Area <span className="text-red-500">*</span>
            </label>
            <input
              id="landArea"
              name="landArea"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. 5 acres"
            />
          </div>
          <div>
            <label htmlFor="farmingType" className="block text-sm font-medium text-zinc-700">
              Type of Farming <span className="text-red-500">*</span>
            </label>
            <select
              id="farmingType"
              name="farmingType"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Select</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Dairy">Dairy</option>
              <option value="Organic">Organic</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
          <div>
            <label htmlFor="documentUrl" className="block text-sm font-medium text-zinc-700">
              Document Upload URL (optional)
            </label>
            <input
              id="documentUrl"
              name="documentUrl"
              type="url"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="https://... (upload to cloud storage and paste link)"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Upload your land/identity documents to a cloud service and paste the URL here.
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
          <h1 className="text-2xl font-semibold text-zinc-900">Farmer Verification</h1>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            Verification in progress
          </span>
        </div>
        <p className="text-zinc-600">
          Your Farmer verification is under review. You will be notified once approved.
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
          <h1 className="text-2xl font-semibold text-zinc-900">Farmer Account</h1>
          <span className="mt-2 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            Suspended
          </span>
        </div>
        <p className="text-zinc-600">
          Your Farmer account has been suspended. Please contact support.
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
  const farmerSections = [
    { title: "Browse products", desc: "Same shopping experience as consumers.", href: "/", icon: "🛒", ariaLabel: "Browse products" },
    { title: "Add products", desc: "Create new product listings (go to admin for approval).", href: "/dashboard/products/new", icon: "➕", ariaLabel: "Add new products" },
    { title: "My products", desc: "Manage your existing listings.", href: "#", icon: "🌾", ariaLabel: "Manage your farm products" },
    { title: "Orders", desc: "View & manage incoming orders.", href: "#", icon: "📋", ariaLabel: "View orders" },
  ];

  return (
    <div role="main" aria-label="Farmer dashboard">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Farmer Dashboard</h1>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800" aria-hidden="true">
          Farmer
        </span>
      </div>
      <p className="text-zinc-600">
        Sell farm produce only: vegetables, fruits, grains, dairy, organic. Add / edit / delete your
        products, manage inventory & orders.
      </p>

      <nav className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Farmer dashboard quick links">
        {farmerSections.map((card) => (
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
