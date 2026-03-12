import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getApprovedRoles, getRoleStatus } from "@/lib/auth";

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

  // Consumer is always available once logged in; Farmer / Retailer depend on status (handled in subpages).
  const hasConsumer = approved.includes("CONSUMER");
  
  // Always show all major specialized roles so users can apply for them.
  const availableRoles = ROLE_CONFIG;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Account Hub</h1>
        <p className="mt-2 text-zinc-600 text-lg">
          Welcome to your AgriBridge command center. Switch between your specialized dashboards below.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hasConsumer && (
          <Link
            href="/"
            className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              🛒
            </div>
            <h2 className="text-2xl font-black text-zinc-900 group-hover:text-emerald-700 transition-colors">Consumer</h2>
            <p className="mt-2 text-zinc-500 leading-relaxed">
              Explore the marketplace, manage your personal orders, and discover premium agri-produce.
            </p>
            <div className="mt-6 flex items-center font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              Open Marketplace <span className="ml-2">→</span>
            </div>
          </Link>
        )}

        {availableRoles.map((r) => {
          const status = getRoleStatus(session, r.role);
          const isApproved = status === "APPROVED";
          const isPending = status === "PENDING";
          
          return (
            <Link
              key={r.role}
              href={r.path}
              className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${r.role === 'FARMER' ? 'bg-amber-500/5' : 'bg-blue-500/5'} rounded-full -mr-16 -mt-16 blur-2xl transition-colors`}></div>
              
              {/* Status Badge */}
              <div className="absolute top-6 right-8">
                {isApproved ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Verified
                  </span>
                ) : isPending ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Pending
                  </span>
                ) : null}
              </div>

              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${r.role === 'FARMER' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'} text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                {r.role === 'FARMER' ? '🚜' : '🏪'}
              </div>
              <h2 className="text-2xl font-black text-zinc-900 group-hover:text-emerald-700 transition-colors">{r.label}</h2>
              <p className="mt-2 text-zinc-500 leading-relaxed">{r.desc}</p>
              <div className="mt-6 flex items-center font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                {isApproved ? `Enter ${r.label} Suite` : isPending ? "Check Status" : `Join as ${r.label}`} 
                <span className="ml-2">→</span>
              </div>
            </Link>
          );
        })}

        {/* Add more roles card - consistent design */}
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 flex flex-col justify-center items-center text-center">
             <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400 mb-4">
                ➕
             </div>
             <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest leading-tight">Expansion<br/>Available</p>
             <p className="mt-2 text-xs text-zinc-400 max-w-[150px]">Apply for more business roles anytime.</p>
        </div>
      </div>

      <div className="mt-16 flex items-center justify-between border-t border-zinc-100 pt-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-emerald-600 transition-colors"
        >
          <span>←</span> Back to homepage
        </Link>
        <p className="text-xs text-zinc-400 font-medium">AgriBridge Account Management v2.0</p>
      </div>
    </div>
  );
}
