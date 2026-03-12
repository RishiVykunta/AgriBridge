import Link from "next/link";
import { CheckCircle2, TrendingUp, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { HomeHeaderServer } from "@/app/components/HomeHeaderServer";

export default function SellOnAgriBridge() {
  return (
    <div className="min-h-screen bg-white">
      <HomeHeaderServer />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/seller_hero_realistic_1773348463355.png" 
            alt="AgriBridge Seller Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Scale Your <span className="text-emerald-400">Agri-Business</span> Globally.
            </h1>
            <p className="mt-6 text-xl text-zinc-300 leading-relaxed">
              Connect directly with millions of buyers, retailers, and distributors. 
              AgriBridge provides the tools, logistics, and trust you need to grow your agricultural enterprise.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link 
                href="/signup" 
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 group"
              >
                Join as Seller
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#how-it-works" 
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Buyers", value: "2M+" },
              { label: "Daily Transactions", value: "₹50Cr+" },
              { label: "Farming Partners", value: "10K+" },
              { label: "Logistics Reach", value: "500+ Cities" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-5xl font-black text-zinc-900">{stat.value}</p>
                <p className="mt-2 text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="benefits" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Why Sell on AgriBridge?</h2>
            <p className="mt-4 text-zinc-600 text-lg">We handle the complexity, so you can focus on producing quality.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="text-emerald-500" size={32} />,
                title: "Maximum Reach",
                desc: "Get your products in front of retailers and individual consumers across the nation without worrying about intermediaries.",
              },
              {
                icon: <ShieldCheck className="text-emerald-500" size={32} />,
                title: "Secure Payments",
                desc: "Transparent escrow-based payment system. Get paid on time, every time, directly into your business account.",
              },
              {
                icon: <Users className="text-emerald-500" size={32} />,
                title: "Direct Support",
                desc: "Dedicated account managers to help you optimize your listings, pricing, and fulfillment strategies.",
              },
            ].map((benefit, i) => (
              <div key={i} className="p-8 rounded-3xl border border-zinc-200 hover:border-emerald-500 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900">{benefit.title}</h3>
                <p className="mt-4 text-zinc-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Glassy */}
      <section id="how-it-works" className="py-32 bg-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-black text-white leading-tight">Become a Verified Seller in <span className="text-emerald-400">3 Easy Steps</span></h2>
              <ul className="mt-12 space-y-8">
                {[
                  { step: "01", title: "Quick Registration", desc: "Sign up with your business details and GST/Pan information." },
                  { step: "02", title: "List Your Inventory", desc: "Upload high-quality images and descriptions of your agri-products." },
                  { step: "03", title: "Start Receiving Orders", desc: "Monitor your dashboard, fulfill orders, and scale your brand." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-6">
                    <span className="text-3xl font-black text-emerald-500/40">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-bold text-white">{item.title}</h4>
                      <p className="mt-2 text-zinc-400">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 p-4 bg-white/5 backdrop-blur-xl">
                 <div className="absolute inset-x-8 top-8 bottom-8 rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                       src="/seller_hero_realistic_1773348463355.png" 
                       className="w-full h-full object-cover grayscale opacity-50"
                       alt="Process Preview"
                    />
                    <div className="absolute inset-0 bg-emerald-900/40 mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4">
                          <CheckCircle2 className="text-emerald-600" size={32} />
                          <div>
                             <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Seller Status</p>
                             <p className="text-lg font-bold text-zinc-900 leading-none">Account Verified</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to transform your agricultural business?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto bg-zinc-900 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-zinc-800 transition-all shadow-xl"
            >
              Get Started Now
            </Link>
            <p className="text-emerald-100 font-medium">Join 10,000+ success stories today.</p>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-zinc-500 font-medium">© 2026 AgriBridge Enterprise Systems. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-bold text-zinc-900 uppercase tracking-widest">
            <Link href="#" className="hover:text-emerald-600">Privacy</Link>
            <Link href="#" className="hover:text-emerald-600">Terms</Link>
            <Link href="/corporate" className="hover:text-emerald-600">Corporate</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
