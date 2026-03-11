import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) redirect("/login");

  const { role: activeRole = "FARMER" } = await searchParams;

  const allUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { roles: true },
  });

  // Count pending products per seller (Farmer / Retailer)
  const pendingProducts = await prisma.product.findMany({
    where: { status: "PENDING" },
    select: { sellerId: true },
  });

  const pendingMap = new Map<string, number>();
  for (const row of pendingProducts) {
    pendingMap.set(row.sellerId, (pendingMap.get(row.sellerId) ?? 0) + 1);
  }

  // Filter users based on roles for the selected tab
  const filteredUsers = allUsers.filter((u) =>
    u.roles.some((r) => r.role === activeRole)
  );

  const tabs = [
    { id: "FARMER", label: "Farmers", icon: "🌾" },
    { id: "RETAILER", label: "Retailers", icon: "🏪" },
    { id: "CONSUMER", label: "Consumers", icon: "🛍️" },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">User Management</h1>
          <p className="mt-2 text-zinc-500">
            Manage your community members and track their application status.
          </p>
        </div>
      </div>

      {/* Modern Professional Tabs */}
      <div className="mt-8 border-b border-zinc-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeRole === tab.id;
            return (
              <Link
                key={tab.id}
                href={`?role=${tab.id}`}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                  ${
                    isActive
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                  }
                `}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
                <span
                  className={`
                    ml-2.5 rounded-full py-0.5 px-2.5 text-xs font-medium inline-block
                    ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
                    }
                  `}
                >
                  {allUsers.filter((u) => u.roles.some((r) => r.role === tab.id)).length}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-100">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50/50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-zinc-700">Account Information</th>
              <th className="px-6 py-4 text-left font-semibold text-zinc-700">Role Details</th>
              <th className="px-6 py-4 text-right font-semibold text-zinc-700">Status & Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const roles = u.roles;
                const activeRoleData = roles.find((r) => r.role === activeRole);
                const pendingCount = pendingMap.get(u.id) ?? 0;
                
                return (
                  <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-medium border border-zinc-200">
                          {(u.name?.[0] ?? u.email?.[0] ?? "?").toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900">{u.name || "Anonymous User"}</div>
                          <div className="text-zinc-500 text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {roles.map((r) => (
                          <span 
                            key={r.id} 
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                              r.role === activeRole 
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" 
                                : "bg-zinc-50 text-zinc-600 ring-zinc-500/10"
                            }`}
                          >
                            {r.role} • {r.status}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-[10px] text-zinc-400 font-mono">
                        ID: {u.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {activeRoleData?.status === "PENDING" && (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                            Awaiting Approval
                          </span>
                        )}
                        {(activeRole === "FARMER" || activeRole === "RETAILER") && pendingCount > 0 && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                            <span className="animate-pulse">🔔</span> {pendingCount} Pending Requests
                          </span>
                        )}
                        {filteredUsers.length > 0 && (
                          <Link 
                            href={`/dashboard/admin/users/${u.id}`}
                            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            View Profile →
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-zinc-500 italic">
                  No {activeRole.toLowerCase()}s found in this database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 pt-6 border-t border-zinc-100">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}

