import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasRole(session, "ADMIN")) redirect("/dashboard");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Admin Dashboard</h1>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
          Admin
        </span>
      </div>
      <p className="text-zinc-600">
        Full platform control. View all users, products, orders. Approve / reject / suspend farmers & retailers.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Users", desc: "View all consumers, farmers, retailers", href: "/dashboard/admin/users" },
          { title: "Product Requests", desc: "Approve or reject new products", href: "/dashboard/admin/products" },
          { title: "Catalog", desc: "View, edit, and delete products", href: "/dashboard/admin/catalog" },
          { title: "Orders", desc: "View all orders", href: "#" },
          { title: "Role Requests", desc: "Approve / reject farmer & retailer roles", href: "/dashboard/admin/roles" },
          { title: "Listings", desc: "Moderate listings", href: "#" },
          { title: "Documents", desc: "View verification documents", href: "#" },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow"
          >
            <h2 className="font-semibold text-zinc-900">{card.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{card.desc}</p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700">
          ← Switch role
        </Link>
      </p>
    </div>
  );
}
