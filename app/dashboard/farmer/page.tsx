import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getRoleStatus } from "@/lib/auth";
import { requestFarmerVerification } from "@/app/actions/auth";
import { 
  LayoutDashboard, 
  Store, 
  PlusCircle, 
  ClipboardList, 
  HelpCircle, 
  Clock, 
  AlertCircle, 
  MapPin, 
  AreaChart, 
  Tag, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from "lucide-react";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function FarmerDashboardPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const status = getRoleStatus(session, "FARMER");
  const { error } = await searchParams;

  // 1. NO ROLE: Modern Verification Form
  if (!status) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 text-white p-8 md:p-12 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
                <ShieldCheck size={14} />
                Seller Onboarding
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">Farmer Verification</h1>
              <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
                Unlock your agricultural storefront. Provide your farming details to start selling directly 
                to retailers and consumers across the network.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-4xl shadow-inner">
                 🚜
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
              <form action={requestFarmerVerification} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      name="fullName" 
                      type="text" 
                      required 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-emerald-500 transition-all outline-none" 
                      placeholder="As per Government ID" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Mobile Number</label>
                    <input 
                      name="mobile" 
                      type="tel" 
                      required 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-emerald-500 transition-all outline-none" 
                      placeholder="10-digit mobile" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Aadhaar / Farmer ID</label>
                  <input 
                    name="aadhaar" 
                    type="text" 
                    required 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-emerald-500 transition-all outline-none" 
                    placeholder="12-digit identification number" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <MapPin size={12} /> Farm Location
                  </label>
                  <textarea 
                    name="farmLocation" 
                    rows={2} 
                    required 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-emerald-500 transition-all outline-none" 
                    placeholder="Village, District, State" 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <AreaChart size={12} /> Land Area
                    </label>
                    <input 
                      name="landArea" 
                      required 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-emerald-500 transition-all outline-none" 
                      placeholder="e.g. 5 Acres" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Tag size={12} /> Farming Type
                    </label>
                    <select name="farmingType" required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none">
                      <option value="">Select Category</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Grains">Grains</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Organic">Organic</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Document Link (Public Portfolio/Drive)</label>
                  <input 
                    name="documentUrl" 
                    type="url" 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-emerald-500 transition-all outline-none" 
                    placeholder="https://..." 
                  />
                  <p className="text-[10px] text-zinc-400 italic">Optional: Provide a link to your land titles or certificates.</p>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
               <h3 className="font-black text-emerald-900 uppercase text-xs tracking-widest mb-4">Why Verify?</h3>
               <ul className="space-y-4">
                 {[
                   "Access Institutional Buyers",
                   "Verified Seller Badge",
                   "Priority Logistics Support",
                   "Weekly Payouts"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-sm text-emerald-700 font-bold">
                     <CheckCircle2 size={16} />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
             
             <Link href="/dashboard" className="flex items-center justify-between p-6 rounded-3xl border border-zinc-200 hover:border-emerald-500 transition-colors group">
               <div>
                 <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Navigation</p>
                 <p className="text-sm font-bold text-zinc-900">Switch Hub Role</p>
               </div>
               <ArrowRight size={20} className="text-zinc-400 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
             </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. PENDING: Premium Status UI
  if (status === "PENDING") {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-amber-50 text-4xl mb-8 animate-bounce transition-all">
          ⌛
        </div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Review in Progress</h1>
        <p className="mt-4 text-zinc-500 text-lg max-w-lg mx-auto leading-relaxed font-medium">
          Our verification team is carefully reviewing your agricultural credentials. 
          Expect a decision within 24-48 business hours.
        </p>
        <div className="mt-12 max-w-md mx-auto aspect-video rounded-3xl border border-zinc-200 bg-zinc-50/50 flex flex-col items-center justify-center p-8">
           <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
             <div className="w-[65%] h-full bg-amber-500 rounded-full"></div>
           </div>
           <p className="mt-4 text-xs font-black text-zinc-400 uppercase tracking-widest">Verification Status: 65% Complete</p>
        </div>

        <p className="mt-12">
          <Link href="/dashboard" className="text-sm font-bold text-emerald-600 hover:underline">
            ← Return to Account Hub
          </Link>
        </p>
      </div>
    );
  }

  // 3. SUSPENDED: High-Alert UI
  if (status === "SUSPENDED") {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-red-50 text-red-500 text-4xl mb-8">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Account Restricted</h1>
        <p className="mt-4 text-zinc-500 text-lg max-w-lg mx-auto font-medium">
          Access to your Farmer Dashboard has been suspended due to verification discrepancies.
        </p>
        <div className="mt-10">
          <Link href="/support" className="bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all">
            Contact Appeals Team
          </Link>
        </div>
      </div>
    );
  }

  // 4. APPROVED: Feature-Rich Dashboard
  const farmerSections = [
    { 
      title: "Storefront", 
      desc: "Live view of your products marketplace.", 
      href: "/", 
      icon: <Store size={24} />, 
      color: "bg-emerald-50 text-emerald-600",
      stats: "Live"
    },
    { 
      title: "Add Products", 
      desc: "Create new verified farm listings.", 
      href: "/dashboard/products/new", 
      icon: <PlusCircle size={24} />, 
      color: "bg-blue-50 text-blue-600",
      stats: "Quick"
    },
    { 
      title: "My Inventory", 
      desc: "Manage and optimize your produce.", 
      href: "/dashboard/products", 
      icon: <ClipboardList size={24} />, 
      color: "bg-amber-50 text-amber-600",
      stats: "Detailed"
    },
    { 
      title: "Consultant", 
      desc: "Talk to our agri-specialists.", 
      href: "/services", 
      icon: <HelpCircle size={24} />, 
      color: "bg-purple-50 text-purple-600",
      stats: "Pro"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-[3rem] bg-white border border-zinc-200 p-8 md:p-12 shadow-xl mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
             <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             Verified Farmer Suite
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight leading-none mb-4">Farmer Dashboard</h1>
          <p className="text-zinc-500 text-lg max-w-xl font-medium leading-relaxed">
            Manage your digital crop inventory, track live market orders, and access institutional trade tools directly.
          </p>
        </div>
        <div className="relative z-10 bg-zinc-900 p-8 rounded-[2.5rem] text-white shadow-2xl min-w-[280px]">
           <div className="flex justify-between items-start mb-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Yield Health</p>
              <div className="text-emerald-400"><LayoutDashboard size={20} /></div>
           </div>
           <p className="text-3xl font-black mb-1">Excellent</p>
           <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
             <TrendingUp size={12} /> +12.5% this month
           </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {farmerSections.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative flex flex-col rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className={`mb-6 h-14 w-14 items-center justify-center rounded-2xl ${card.color} flex shadow-inner group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-black text-zinc-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight text-xs">{card.title}</h2>
               <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{card.stats}</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">{card.desc}</p>
            <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between text-sm font-bold text-emerald-600">
              Open Module
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Institutional Tools Card */}
      <div className="bg-zinc-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
               <h3 className="text-3xl font-black mb-4 tracking-tight">Enterprise Scaling Tools</h3>
               <p className="text-zinc-400 max-w-md font-medium">Access bulk logistics, insurance, and interest-free seeds through our farmer-first support programs.</p>
            </div>
            <Link href="/services" className="bg-emerald-600 text-white px-10 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/10 flex items-center gap-2">
               Unlock Support <Lock size={20} />
            </Link>
         </div>
      </div>

      <div className="mt-16 text-center">
         <Link href="/dashboard" className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-zinc-200 text-zinc-400 font-bold hover:text-zinc-900 hover:border-zinc-900 transition-all text-sm">
            <span>←</span> Switch Role Hub
         </Link>
      </div>
    </div>
  );
}

// Add TrendingUp for the card
function TrendingUp({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
