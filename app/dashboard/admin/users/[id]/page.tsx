import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminUserProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session || !hasRole(session, "ADMIN")) redirect("/login");

  const { id } = await params;
  const { message, error } = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: true,
      products: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="max-w-5xl mx-auto pb-16 px-4">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Users List
        </Link>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-800 font-medium">
          ✅ {message}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-800 font-medium">
          ❌ {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Profile Card */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden ring-1 ring-zinc-50">
            <div className="bg-emerald-600 h-24 w-full"></div>
            <div className="px-6 pb-8 -mt-12">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg ring-1 ring-zinc-100">
                  <div className="h-full w-full rounded-full bg-zinc-50 flex items-center justify-center text-3xl font-bold text-emerald-600">
                    {(user.name?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h1 className="text-2xl font-bold text-zinc-900">{user.name || "Anonymous User"}</h1>
                <p className="text-zinc-500 text-sm mt-1">{user.email}</p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-zinc-400 w-24 text-right">Phone</span>
                  <span className="text-zinc-700 font-medium">{user.phone || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-zinc-400 w-24 text-right">Joined</span>
                  <span className="text-zinc-700 font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-zinc-400 w-24 text-right">User ID</span>
                  <span className="text-zinc-500 font-mono text-[10px] bg-zinc-50 px-2 py-1 rounded">
                    {user.id}
                  </span>
                </div>
              </div>

              <div className="mt-10">
                <button className="w-full bg-zinc-900 text-white py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2">
                  Edit User Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Roles & Activity */}
        <div className="flex-1 space-y-8">
          {/* Roles Section */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden p-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0a11.955 11.955 0 00-1.017 4.542c0 4.394-2.58 8.243-6.236 10.052m-11.472 0A11.955 11.955 0 0112 22a11.955 11.955 0 01-8.618-3.04m17.236 0a11.955 11.955 0 00-1.017 4.542c0 4.394-2.58 8.243-6.236 10.052" />
              </svg>
              Assigned Roles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.roles.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Role</span>
                      <p className="text-lg font-bold text-zinc-900">{r.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      r.status === "APPROVED" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : r.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {r.status === "PENDING" && (
                      <button className="flex-1 text-[11px] font-bold bg-white border border-zinc-200 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                        Approve Role
                      </button>
                    )}
                    <button className="flex-1 text-[11px] font-bold bg-white border border-zinc-200 text-zinc-600 py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                      Manage Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity/Products Section */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Recent Products
              </h2>
              <span className="text-sm text-zinc-400 font-medium">{user.products.length} Items Listed</span>
            </div>
            {user.products.length > 0 ? (
              <div className="space-y-4">
                {user.products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-emerald-200 transition-all hover:bg-emerald-50/10 group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden">
                        <div className="h-full w-full flex items-center justify-center text-zinc-400">📦</div>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">{p.name}</p>
                        <p className="text-xs text-zinc-500">Listed on {new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-zinc-900">₹{Number(p.price).toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase ${
                        p.status === "APPROVED" ? "text-emerald-600" : "text-amber-600"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-4 text-sm font-bold text-zinc-400 hover:text-emerald-600 transition-colors py-2">
                  View All Products →
                </button>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                  <span className="text-2xl text-zinc-300">🍃</span>
                </div>
                <p className="text-zinc-500 italic">No products listed by this user yet.</p>
              </div>
            )}
          </div>

          {/* Account Security Section */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden p-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Account Security
            </h2>
            
            <div className="p-6 rounded-2xl border border-red-100 bg-red-50/30">
              <h3 className="text-sm font-bold text-red-800">Reset User Password</h3>
              <p className="text-xs text-red-600 mt-1">
                Administrators can reset the user's password if they are unable to log in.
              </p>
              
              <form action={async (formData) => {
                "use server";
                const { resetUserPassword } = await import("@/app/actions/auth");
                await resetUserPassword(formData);
              }} className="mt-4 flex flex-col sm:flex-row gap-3">
                <input type="hidden" name="userId" value={user.id} />
                <input 
                  type="text" 
                  name="newPassword" 
                  placeholder="Enter new password (min 8 chars)" 
                  required
                  className="flex-1 rounded-xl border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button 
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
