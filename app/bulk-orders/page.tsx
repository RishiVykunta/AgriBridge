import Link from "next/link";
import { Package, Truck, Award, Headphones, ChevronRight, BarChart3, Globe } from "lucide-react";
import { HomeHeaderServer } from "@/app/components/HomeHeaderServer";

export default function BulkOrders() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <HomeHeaderServer />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-white border-b border-zinc-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest mb-6">
                < Award size={14} />
                B2B Excellence
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-zinc-900 leading-[1.1] tracking-tight">
                Premium Supply for <span className="text-emerald-600">Scale</span>.
              </h1>
              <p className="mt-6 text-xl text-zinc-500 leading-relaxed max-w-xl">
                AgriBridge connects institutional buyers, hotel chains, and retail giants 
                directly to the source. Get consistent quality, competitive pricing, and 
                reliable logistics for all your bulk agricultural needs.
              </p>
              <div className="mt-10 flex gap-4">
                <Link 
                  href="#enquiry-form" 
                  className="bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all hover:shadow-xl"
                >
                  Request Quote
                </Link>
                <Link 
                  href="/corporate" 
                  className="bg-white border border-zinc-200 text-zinc-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-50 transition-all"
                >
                  View Our Reach
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="/bulk_orders_b2b_realistic_1773348586410.png" 
                  className="w-full aspect-[4/3] object-cover"
                  alt="B2B Agricultural Supply"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <BarChart3 className="text-emerald-600" />,
                title: "Wholesale Economics",
                desc: "Direct-from-farm sourcing eliminates middleman margins, providing you with the most competitive institutional pricing in the market."
              },
              {
                icon: <Truck className="text-emerald-600" />,
                title: "Cold-Chain Logistics",
                desc: "Our integrated logistics network ensures that produce reaches your distribution centers with peak freshness maintained throughout."
              },
              {
                icon: <Award className="text-emerald-600" />,
                title: "Quality Standardized",
                desc: "Every bulk batch undergoes rigorous quality checks and grading based on your specific institutional requirements."
              }
            ].map((pillar, i) => (
              <div key={i} className="group">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-4">{pillar.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form Sub-section */}
      <section id="enquiry-form" className="py-24 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-zinc-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/3">
                <h2 className="text-4xl font-black text-white leading-tight">Send a Bulk Enquiry</h2>
                <p className="mt-4 text-zinc-400">Our B2B specialists will analyze your requirements and reach out with a custom quote within 24 hours.</p>
                
                <div className="mt-12 space-y-6">
                   <div className="flex items-center gap-4 text-white">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                         <Headphones size={20} className="text-emerald-400" />
                      </div>
                      <p className="font-bold">Dedicated Account Manager</p>
                   </div>
                   <div className="flex items-center gap-4 text-white">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                         <Package size={20} className="text-emerald-400" />
                      </div>
                      <p className="font-bold">Custom Packaging Options</p>
                   </div>
                   <div className="flex items-center gap-4 text-white">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                         <Globe size={20} className="text-emerald-400" />
                      </div>
                      <p className="font-bold">Nationwide Delivery</p>
                   </div>
                </div>
              </div>

              <div className="lg:w-2/3 flex-1">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10">
                  <form className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Full Name</label>
                       <input type="text" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Company Name</label>
                       <input type="text" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Agro Retailers Ltd" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Email Address</label>
                       <input type="email" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="john@company.com" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Requirement (Tons)</label>
                       <select className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none appearance-none">
                          <option className="bg-zinc-800">1 - 5 Tons</option>
                          <option className="bg-zinc-800">5 - 20 Tons</option>
                          <option className="bg-zinc-800">20+ Tons (Institutional)</option>
                       </select>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Detailed Message</label>
                       <textarea rows={4} className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Tell us what you're looking for..."></textarea>
                    </div>
                    <button className="sm:col-span-2 bg-emerald-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95">
                      Submit Business Enquiry
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Support */}
      <section className="py-20 text-center">
        <p className="text-zinc-500 font-medium">Already a registered business partner?</p>
        <div className="mt-4 flex items-center justify-center gap-2">
           <Link href="/login" className="text-emerald-700 font-black uppercase tracking-tighter hover:underline flex items-center gap-1">
              Login to B2B Dashboard <ChevronRight size={16} />
           </Link>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-zinc-200 text-center">
         <p className="text-zinc-400 text-sm font-medium">© 2026 AgriBridge B2B Solutions. Bridging the gap at scale.</p>
      </footer>
    </div>
  );
}
