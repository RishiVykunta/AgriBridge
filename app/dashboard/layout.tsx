import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getApprovedRoles } from "@/lib/auth";
import { logout } from "@/app/actions/auth";

// Switch role: Farmer and Retailer (verification required); Consumer if approved
const ROLE_LINKS: { role: string; label: string; path: string }[] = [
  { role: "FARMER", label: "Farmer", path: "/dashboard/farmer" },
  { role: "RETAILER", label: "Retailer", path: "/dashboard/retailer" },
];

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const approved = getApprovedRoles(session);
  // Show Farmer and Retailer to all; add Consumer if user has it
  const roleLinks = [
    ...(approved.includes("CONSUMER") ? [{ role: "CONSUMER", label: "Consumer", path: "/dashboard/consumer" }] : []),
    ...ROLE_LINKS,
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="text-lg font-bold text-emerald-700 shrink-0">
            AgriBridge
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Switch role">
            {roleLinks.map((r) => (
              <Link
                key={r.role}
                href={r.path}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label={`Switch to ${r.label} dashboard`}
              >
                {r.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-zinc-600 truncate max-w-[120px]">
              {session.name ?? session.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
