import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";
import { getAdminNotificationCounts } from "@/app/actions/applications";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasRole(session, "ADMIN")) redirect("/dashboard");

  const counts = await getAdminNotificationCounts();

  const primaryActions = [
    { 
      title: "Loan Applications", 
      desc: "Review and process tractor/harvester financing requests", 
      href: "/dashboard/admin/loans",
      count: counts.loans,
      color: "emerald",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.599-1H11" /></svg>
      )
    },
    { 
      title: "Specialist Requests", 
      desc: "Connect farmers with lead agricultural scientists", 
      href: "/dashboard/admin/specialists",
      count: counts.specialists,
      color: "amber",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      )
    },
    { 
      title: "User Management", 
      desc: "Moderate farmers, retailers, and consumer accounts", 
      href: "/dashboard/admin/users",
      color: "indigo",
      icon: (        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
  ];

  const secondaryActions = [
    { title: "Catalog Management", href: "/dashboard/admin/catalog", color: "blue" },
    { title: "Product Requests", href: "/dashboard/admin/products", color: "rose", count: counts.products },
    { title: "Role Verifications", href: "/dashboard/admin/roles", color: "violet", count: counts.roles },
    { title: "Order History", href: "#", color: "slate" },
  ];

  const colorMap = {
    emerald: "from-emerald-50 to-emerald-100 hover:border-emerald-500/40 text-emerald-700 bg-emerald-50/50",
    amber: "from-amber-50 to-amber-100 hover:border-amber-500/40 text-amber-700 bg-amber-50/50",
    indigo: "from-indigo-50 to-indigo-100 hover:border-indigo-500/40 text-indigo-700 bg-indigo-50/50",
    blue: "bg-blue-50/50 border-blue-100 hover:border-blue-400 text-blue-700",
    rose: "bg-rose-50/50 border-rose-100 hover:border-rose-400 text-rose-700",
    violet: "bg-violet-50/50 border-violet-100 hover:border-violet-400 text-violet-700",
    slate: "bg-slate-50/50 border-slate-100 hover:border-slate-400 text-slate-700",
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="relative z-10 p-8 md:p-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
               <div className="h-12 w-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-zinc-900/20 rotate-3 transform transition-transform hover:rotate-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                 <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-0.5">AgriBridge Systems</span>
                 <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-600 flex items-center gap-1.5">
                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   System Administrator
                 </span>
               </div>
            </div>
            <h1 className="text-6xl font-black text-zinc-900 tracking-tight mb-3">
              Command <span className="text-emerald-500 italic">Center</span>
            </h1>
            <p className="text-zinc-500 font-medium text-lg max-w-xl leading-relaxed">
              Monitoring platform health, processing applications, and overseeing ecosystem growth.
            </p>
          </div>

          <div className="flex items-center gap-4">
             {counts.total > 0 && (
               <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md text-amber-600 px-6 py-3 rounded-2xl border border-amber-100 shadow-lg shadow-amber-900/5 group hover:scale-105 transition-transform cursor-pointer">
                  <div className="relative">
                    <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{counts.total} Pending Tasks</span>
               </div>
             )}
             <div className="h-14 w-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all cursor-pointer group">
                <svg className="w-7 h-7 group-hover:text-zinc-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid gap-10 lg:grid-cols-3">
          {primaryActions.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative overflow-hidden rounded-[40px] border border-zinc-200 bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 ${colorMap[card.color as keyof typeof colorMap].split(' ').slice(0, 3).join(' ')}`}
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000 grayscale">
                {card.icon}
              </div>

              <div className="flex items-start justify-between mb-20 relative z-10">
                 <div className={`h-16 w-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg ${colorMap[card.color as keyof typeof colorMap].split(' ').pop()} ${colorMap[card.color as keyof typeof colorMap].split(' ').slice(-2, -1)[0]}`}>
                    {card.icon}
                 </div>
                 {card.count !== undefined && card.count > 0 && (
                    <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-1.5 rounded-2xl text-[11px] font-black tracking-widest shadow-lg">
                       <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                       {card.count} NEW
                    </div>
                 )}
              </div>
              
              <div className="relative z-10">
                 <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-3 group-hover:translate-x-1 transition-transform">{card.title}</h2>
                 <p className="text-zinc-500 font-medium leading-relaxed text-base group-hover:text-zinc-600">{card.desc}</p>
              </div>
              
              <div className="mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                <span>View Console</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary Quick Links */}
        <div className="mt-24 pt-12 border-t border-zinc-100">
           <div className="flex items-center gap-4 mb-10">
             <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">System Modules</h3>
             <div className="h-px bg-zinc-100 flex-1" />
           </div>
           
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {secondaryActions.map(link => (
                 <Link 
                   key={link.title} 
                   href={link.href}
                   className={`flex items-center justify-between p-7 rounded-[24px] bg-white border border-zinc-100 shadow-sm transition-all group hover:scale-[1.02] hover:shadow-lg ${colorMap[link.color as keyof typeof colorMap]}`}
                 >
                    <div className="flex items-center gap-3">
                       <span className="text-[11px] font-black text-zinc-600 group-hover:text-inherit transition-colors uppercase tracking-[0.2em]">{link.title}</span>
                       {(link as any).count > 0 && (
                          <div className="flex items-center gap-1.5 bg-zinc-900 text-white px-2.5 py-1 rounded-full text-[9px] font-black">
                             <svg className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                             {(link as any).count}
                          </div>
                       )}
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-current group-hover:text-white transition-all transform group-hover:rotate-45">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                 </Link>
              ))}
           </div>
        </div>

        <footer className="mt-24 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-zinc-900 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Personal Dashboard
          </Link>
          <div className="mt-8 text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
            AgriBridge Platform Management v2.4.0
          </div>
        </footer>
      </div>
    </div>
  );
}
