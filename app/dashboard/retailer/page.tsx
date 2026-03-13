import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getRoleStatus } from "@/lib/auth";
import { requestRetailerVerification } from "@/app/actions/auth";
import { 
  ShoppingCart, 
  Plus, 
  Store, 
  ClipboardCheck, 
  Users, 
  Settings, 
  ShieldCheck, 
  AlertCircle, 
  MapPin, 
  Building2, 
  Tag, 
  ArrowRight, 
  Lock, 
  CheckCircle2,
  TrendingDown,
  Clock
} from "lucide-react";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function RetailerDashboardPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const status = getRoleStatus(session, "RETAILER");
  const { error } = await searchParams;

  // 1. NO ROLE: Modern Retailer Verification Form
  if (!status) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-blue-950 text-white p-8 md:p-12 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-widest mb-4">
                <ShieldCheck size={14} />
                Retail Partner Program
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">Retailer verification</h1>
              <p className="mt-4 text-blue-100/60 text-lg leading-relaxed font-medium">
                Equip farmers with the best inputs. Submit your retail business credentials to start 
                selling seeds, fertilizers, and machinery on the AgriBridge platform.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-4xl shadow-inner">
                 🏪
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
              <form action={requestRetailerVerification} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Building2 size={12} /> Shop / Business Name
                  </label>
                  <input 
                    name="shopName" 
                    type="text" 
                    required 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 transition-all outline-none text-zinc-900" 
                    placeholder="Official registered name" 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Owner Name</label>
                    <input 
                      name="ownerName" 
                      type="text" 
                      required 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 transition-all outline-none text-zinc-900" 
                      placeholder="Proprietor Full Name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">GSTIN</label>
                    <input 
                      name="gstNumber" 
                      type="text" 
                      required 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 transition-all outline-none text-zinc-900" 
                      placeholder="15-digit GST Number" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <MapPin size={12} /> Shop Address
                  </label>
                  <textarea 
                    name="shopAddress" 
                    rows={2} 
                    required 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 transition-all outline-none text-zinc-900" 
                    placeholder="Full Business Location" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Contact Number</label>
                  <input 
                    name="contactNumber" 
                    type="tel" 
                    required 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 transition-all outline-none text-zinc-900" 
                    placeholder="Primary Business Contact" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Tag size={12} /> Trade License / License URL
                  </label>
                  <input 
                    name="businessLicenseUrl" 
                    type="url" 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 transition-all outline-none text-zinc-900" 
                    placeholder="https://..." 
                  />
                  <p className="text-[10px] text-zinc-400 italic">Optional: Public link to your business certificates.</p>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                >
                  Verify Business
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
               <h3 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-4">Retailer Perks</h3>
               <ul className="space-y-4">
                 {[
                   "Bulk Inventory Tools",
                   "Verified Storefront",
                   "Farming Insights",
                   "Tax Assistance"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-sm text-blue-700 font-bold">
                     <CheckCircle2 size={16} />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
             
             <Link href="/dashboard" className="flex items-center justify-between p-6 rounded-3xl border border-zinc-200 hover:border-blue-500 transition-colors group">
               <div>
                 <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Navigation</p>
                 <p className="text-sm font-bold text-zinc-900">Return to Hub</p>
               </div>
               <ArrowRight size={20} className="text-zinc-400 group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
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
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-blue-50 text-4xl mb-8 animate-pulse transition-all">
          🏪
        </div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Business Under Review</h1>
        <p className="mt-4 text-zinc-500 text-lg max-w-lg mx-auto leading-relaxed font-medium">
          We are currently verifying your retail GST and license details. 
          Your dashboard will unlock as soon as the verification is complete.
        </p>
        <div className="mt-12 max-w-sm mx-auto p-6 rounded-3xl border-2 border-dashed border-zinc-200 text-zinc-400 flex flex-col items-center gap-4">
           <Clock size={32} />
           <p className="text-xs font-black uppercase tracking-widest">Est. Completion: 24 Hours</p>
        </div>

        <p className="mt-12">
          <Link href="/dashboard" className="text-sm font-bold text-blue-600 hover:underline">
            ← Switch to Guest Dashboard
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
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Access Revoked</h1>
        <p className="mt-4 text-zinc-500 text-lg max-w-lg mx-auto font-medium">
          Your Retailer access has been suspended due to policy violations or license expiration.
        </p>
        <div className="mt-10">
          <Link href="/support" className="bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all">
            Open Support Ticket
          </Link>
        </div>
      </div>
    );
  }

  // 4. APPROVED: Retail Dashboard
  const retailerSections = [
    { 
      title: "Marketplace", 
      desc: "Live view of the buyer interface.", 
      href: "/", 
      icon: <ShoppingCart size={24} />, 
      color: "bg-emerald-50 text-emerald-600",
      stats: "Public"
    },
    { 
      title: "Add Inventory", 
      desc: "List new inputs and tools.", 
      href: "/dashboard/products/new", 
      icon: <Plus size={24} />, 
      color: "bg-blue-50 text-blue-600",
      stats: "B2B"
    },
    { 
      title: "My Products", 
      desc: "Manage leads and inventory levels.", 
      href: "/dashboard/products", 
      icon: <Store size={24} />, 
      color: "bg-amber-50 text-amber-600",
      stats: "Active"
    },
    { 
      title: "Analytics", 
      desc: "Track sales and demand patterns.", 
      href: "#", 
      icon: <ClipboardCheck size={24} />, 
      color: "bg-purple-50 text-purple-600",
      stats: "Pro Only"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-[3rem] bg-white border border-zinc-200 p-8 md:p-12 shadow-xl mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100">
             <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
             Partner Platinum Suite
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight leading-none mb-4">Retailer Dashboard</h1>
          <p className="text-zinc-500 text-lg max-w-xl font-medium leading-relaxed">
            Manage your agricultural inputs, track wholesale orders, and scale your brand reach across the entire AgriBridge network.
          </p>
        </div>
        <div className="relative z-10 bg-zinc-900 p-8 rounded-[2.5rem] text-white shadow-2xl min-w-[280px]">
           <div className="flex justify-between items-start mb-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Inventory Status</p>
              <div className="text-blue-400"><Store size={20} /></div>
           </div>
           <p className="text-3xl font-black mb-1">Healthy</p>
           <p className="text-xs text-blue-400 font-bold flex items-center gap-1">
             98% Availability
           </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {retailerSections.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative flex flex-col rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className={`mb-6 h-14 w-14 items-center justify-center rounded-2xl ${card.color} flex shadow-inner group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-black text-zinc-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight text-xs">{card.title}</h2>
               <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{card.stats}</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">{card.desc}</p>
            <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between text-sm font-bold text-blue-600">
              Enter Module
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
            {card.href === "#" && (
               <div className="absolute top-4 right-4"><Lock size={12} className="text-zinc-300" /></div>
            )}
          </Link>
        ))}
      </div>

      {/* Business Growth Card */}
      <div className="bg-zinc-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
               <h3 className="text-3xl font-black mb-4 tracking-tight">Scale Your Storefront</h3>
               <p className="text-zinc-400 max-w-md font-medium">Unlock advertising tools, premium listing badges, and direct farmer-connect programs today.</p>
            </div>
            <Link href="/services" className="bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10">
               View Partner Services
            </Link>
         </div>
      </div>

      <div className="mt-16 text-center">
         <Link href="/dashboard" className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-zinc-200 text-zinc-400 font-bold hover:text-zinc-900 hover:border-zinc-900 transition-all text-sm">
            <span>←</span> Back to Role Hub
         </Link>
      </div>
    </div>
  );
}

// Add TrendingUp for the card (shared logic with Farmer dashboard)
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
