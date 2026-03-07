import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getApprovedRoles } from "@/lib/auth";

// Switch role: only Farmer and Retailer (verification required)
const ROLE_CONFIG: { role: string; label: string; path: string; desc: string }[] = [
  { role: "FARMER", label: "Farmer", path: "/dashboard/farmer", desc: "Sell farm produce" },
  { role: "RETAILER", label: "Retailer", path: "/dashboard/retailer", desc: "Sell farming inputs" },
];

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const approved = getApprovedRoles(session);

  // Admin has its own dashboard; no role-switch UI.
  if (approved.includes("ADMIN")) {
    redirect("/dashboard/admin");
  }

  // Consumer is always available once logged in; Farmer / Retailer depend on approval.
  const hasConsumer = approved.includes("CONSUMER");

  const availableRoles = ROLE_CONFIG.filter((r) => approved.includes(r.role));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Switch role</h1>
      <p className="mt-2 text-zinc-600">
        You are currently a Consumer. You can also open other dashboards if approved.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hasConsumer && (
          <Link
            href="/"
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
          >
            <h2 className="font-semibold text-zinc-900">Consumer</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Browse and buy products as a regular customer.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-emerald-600">
              Open Consumer view →
            </span>
          </Link>
        )}
        {availableRoles.map((r) => (
          <Link
            key={r.role}
            href={r.path}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
          >
            <h2 className="font-semibold text-zinc-900">{r.label}</h2>
            <p className="mt-1 text-sm text-zinc-500">{r.desc}</p>
            <span className="mt-3 inline-block text-sm font-medium text-emerald-600">
              Open {r.label} dashboard →
            </span>
          </Link>
        ))}
      </div>

      {availableRoles.length === 1 && (
        <p className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          You can add more roles (e.g. Farmer or Retailer) later from your account or during registration.
        </p>
      )}

      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/" className="text-emerald-600 hover:text-emerald-700">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
