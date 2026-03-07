import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { roles: true },
  });

  // Count pending products per seller (Farmer / Retailer) without using groupBy
  const pendingProducts = await prisma.product.findMany({
    where: { status: "PENDING" },
    select: { sellerId: true },
  });

  const pendingMap = new Map<string, number>();
  for (const row of pendingProducts) {
    pendingMap.set(row.sellerId, (pendingMap.get(row.sellerId) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Users</h1>
      <p className="mt-1 text-sm text-zinc-600">
        View all consumers and approved Farmers / Retailers. Bells show pending product requests.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-zinc-600">
                User
              </th>
              <th className="px-4 py-2 text-left font-medium text-zinc-600">
                Roles
              </th>
              <th className="px-4 py-2 text-left font-medium text-zinc-600">
                Pending product requests
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((u) => {
              const roles = u.roles;
              const roleLabels = roles.map((r) => `${r.role} (${r.status})`);
              const pendingCount = pendingMap.get(u.id) ?? 0;
              const isSellerApproved = roles.some(
                (r) =>
                  (r.role === "FARMER" || r.role === "RETAILER") &&
                  r.status === "APPROVED"
              );

              return (
                <tr key={u.id}>
                  <td className="px-4 py-2 align-top">
                    <div className="font-medium text-zinc-900">
                      {u.name ?? u.email}
                    </div>
                    <div className="text-xs text-zinc-500">{u.email}</div>
                    <div className="mt-1 text-[11px] text-zinc-400">
                      ID: {u.id}
                    </div>
                  </td>
                  <td className="px-4 py-2 align-top text-xs text-zinc-700">
                    {roleLabels.length === 0 ? "—" : roleLabels.join(", ")}
                  </td>
                  <td className="px-4 py-2 align-top">
                    {isSellerApproved && pendingCount > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        🔔 {pendingCount} pending
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400">No pending</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        <Link
          href="/dashboard/admin"
          className="text-emerald-600 hover:text-emerald-700"
        >
          ← Admin Dashboard
        </Link>
      </p>
    </div>
  );
}

