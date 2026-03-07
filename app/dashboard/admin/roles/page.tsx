import { redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { approveRole, rejectRole } from "@/app/actions/auth";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function AdminRolesPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) redirect("/login");

  const pending = await prisma.userRole.findMany({
    where: {
      role: { in: ["FARMER", "RETAILER"] },
      status: "PENDING",
    },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const { error, message } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Role Requests</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Approve or reject Farmer and Retailer role applications.
      </p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          Only Farmer and Retailer roles are shown here. Admin roles are managed separately.
        </p>
        <a
          href="/dashboard/products/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          + Add Product
        </a>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {pending.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">No pending role requests.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {pending.map((ur) => {
            const data = (ur.verificationData ?? {}) as Record<string, unknown>;
            return (
              <div
                key={ur.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-900">
                      {ur.user.name ?? ur.user.email} · {ur.role}
                    </h2>
                    <p className="text-xs text-zinc-500">{ur.user.email}</p>
                    <div className="mt-2 space-y-1 text-xs text-zinc-600">
                      {Object.entries(data).map(([k, v]) =>
                        v ? (
                          <p key={k}>
                            <span className="font-medium capitalize">
                              {k.replace(/([A-Z])/g, " $1").trim()}:
                            </span>{" "}
                            {String(v)}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveRole.bind(null, ur.id)}>
                      <button
                        type="submit"
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={rejectRole.bind(null, ur.id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-sm text-zinc-500">
        <a href="/dashboard/admin" className="text-emerald-600 hover:text-emerald-700">
          ← Admin Dashboard
        </a>
      </p>
    </div>
  );
}
