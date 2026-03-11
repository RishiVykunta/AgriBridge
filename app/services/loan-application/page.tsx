import Link from "next/link";
import { getSession } from "@/lib/auth";
import LeadForm from "./LeadForm";

export default async function LoanApplicationPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Premium Minimal Header */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-100 z-[60] h-20 transition-all duration-500">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">
          <Link href="/" className="group flex items-center gap-3">
             <div className="h-10 w-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
             </div>
             <span className="text-2xl font-black text-zinc-900 tracking-tighter uppercase group-hover:text-emerald-600 transition-colors">AgriBridge</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
             <Link href="/services" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-emerald-600 transition-colors">Services</Link>
             <Link href="/contact" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-emerald-600 transition-colors">Support</Link>
             <Link 
               href="/" 
               className="rounded-full border-2 border-zinc-900 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all"
             >
               Exit Application
             </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-40 pb-24 px-6 grid lg:grid-cols-[1fr,500px] gap-16 items-start">
        <div className="sticky top-40 space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
           <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 mb-6">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </span>
                 Fast-Track Verified
              </div>
              <h1 className="text-6xl font-black text-zinc-900 leading-[0.95] tracking-tight mb-8">
                 Experience <br />
                 <span className="text-emerald-600">Smart Borrowing.</span>
              </h1>
              <p className="text-xl text-zinc-500 font-medium max-w-lg leading-relaxed">
                 Unlock growth with tailored agricultural financing. Our digital lead processing ensures you get the best rates from top-tier institutional lenders.
              </p>
           </div>
           
           <div className="grid gap-6 sm:grid-cols-2">
              {[
                { label: "Paperless Initial Request", icon: "📄" },
                { label: "Doorstep Verification", icon: "🏠" },
                { label: "Accelerated Disbursal", icon: "⚡" },
                { label: "Transparent Fee Structure", icon: "⚖️" },
              ].map(feature => (
                 <div key={feature.label} className="flex items-center gap-4 group">
                    <div className="h-14 w-14 bg-white rounded-3xl flex items-center justify-center text-2xl shadow-sm border border-zinc-100 group-hover:border-emerald-500/30 group-hover:shadow-xl transition-all duration-500">
                       {feature.icon}
                    </div>
                    <span className="text-sm font-bold text-zinc-700 leading-snug">{feature.label}</span>
                 </div>
              ))}
           </div>
           
           <div className="pt-12 border-t border-zinc-200">
              <blockquote className="relative">
                 <div className="absolute -left-4 -top-4 text-7xl text-emerald-100 font-serif opacity-50">"</div>
                 <p className="text-lg text-zinc-600 italic font-medium leading-relaxed relative z-10">
                    AgriBridge has transformed how we approach harvester loans. The process is seamless and built for the modern farmer's needs.
                 </p>
                 <footer className="mt-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-200" />
                    <div>
                       <cite className="block text-sm font-bold text-zinc-900 not-italic">Ramesh Kumar</cite>
                       <span className="text-[10px] font-black uppercase text-zinc-400">Paddy Farmer, Punjab</span>
                    </div>
                 </footer>
              </blockquote>
           </div>
        </div>

        <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
           <LeadForm session={session} />
        </div>
      </main>

      <footer className="bg-zinc-900 py-12 px-8">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-4">
               <span>© 2026 AgriBridge Financial</span>
               <div className="h-1 w-1 bg-zinc-700 rounded-full" />
               <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
               <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-zinc-700">Security Provided By</span>
               <div className="h-6 w-16 bg-zinc-800 rounded opacity-50" />
            </div>
         </div>
      </footer>
    </div>
  );
}
