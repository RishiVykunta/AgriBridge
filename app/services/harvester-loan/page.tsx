import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";

export default async function HarvesterLoanPage() {
  const session = await getSession();
  const isAdmin = session?.roles.some(r => r.role === "ADMIN");

  return (
    <div className="min-h-screen bg-white flex flex-col text-zinc-900 font-sans">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-800">AgriBridge</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/services" className="text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors">
              Other Services
            </Link>
            {session ? (
              <Link 
                href={isAdmin ? "/dashboard/admin" : "/dashboard"} 
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-all shadow-sm"
              >
                {isAdmin ? "Admin Dashboard" : "My Dashboard"}
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-all shadow-sm"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] w-full overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1773167600/A_cinematic_shot_of_a_harvester_symbolizing_efficiency_and_growth._r06lxv.jpg" 
              alt="Professional Harvester" 
              fill 
              className="object-cover brightness-[0.7] transform scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-100 text-xs font-bold uppercase tracking-widest backdrop-blur-sm border border-amber-500/30">
                Heavy Machinery Finance
              </span>
              <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
                Scale Your Harvest with <span className="text-amber-400">Harvester Loans</span>
              </h1>
              <p className="mt-6 text-xl text-zinc-200 leading-relaxed max-w-xl">
                Upgrade to high-performance harvesting equipment with competitive loan options. Special schemes for custom hiring centers and cooperatives.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/services/loan-application?type=harvester"
                  className="rounded-full bg-emerald-500 px-8 py-4 text-sm font-bold text-white hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Proceed to Application
                </Link>
                <Link
                  href="#requirements"
                  className="rounded-full bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-bold text-white hover:bg-white/20 border border-white/30 transition-all"
                >
                  Check Eligibility
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Toggle / Grid */}
        <section className="py-24 bg-zinc-50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-zinc-900">Premium Financing Solutions</h2>
              <p className="mt-4 text-zinc-500 max-w-2xl mx-auto italic font-medium">
                We bridge the gap between your ambition and the technology you need.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: "Tailored Repayment", desc: "Choose from monthly, quarterly, or half-yearly installments based on your crop cycle.", icon: "📅" },
                { title: "High LTV Ratios", desc: "Get up to 90% of the machinery's on-road price financed through our partner banks.", icon: "💰" },
                { title: "Simple Verification", desc: "Fast-track processing for existing AgriBridge members and verified cooperatives.", icon: "✅" },
              ].map((item, i) => (
                <div key={i} className="group bg-white p-10 rounded-3xl border border-zinc-200 hover:border-amber-300 transition-all shadow-sm hover:shadow-xl">
                  <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
                  <p className="mt-4 text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Info Section */}
        <section id="requirements" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
                  <Image 
                    src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1773167600/A_cinematic_shot_of_a_harvester_symbolizing_efficiency_and_growth._r06lxv.jpg" 
                    alt="Harvester Detail" 
                    width={600} 
                    height={400} 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-amber-900/10 active:bg-transparent"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-12">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900">Eligibility & Documentation</h2>
                  <p className="mt-4 text-zinc-600">Our streamline process focuses on transparency and speed. Ensure you have the following ready.</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-amber-700 flex items-center gap-2">
                       KYC Documents
                    </h4>
                    <ul className="space-y-2 text-sm text-zinc-500 font-medium">
                      <li>• Voter ID / Driver's License</li>
                      <li>• Utility Bill for Address Proof</li>
                      <li>• 2 Standard Document Photos</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-amber-700 flex items-center gap-2">
                       Business Proof
                    </h4>
                    <ul className="space-y-2 text-sm text-zinc-500 font-medium">
                      <li>• Business / Income Statements</li>
                      <li>• Cooperative Membership proof</li>
                      <li>• Machine Quotation from Dealer</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-100 flex items-center justify-between">
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Financing Partner: SBI</p>
                  <Link href="/services/tractor-loan" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
                    Need a Tractor Instead? →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact/CTA */}
        <section className="bg-emerald-950 py-24 mx-6 mb-12 rounded-[40px] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 px-6">
            <h2 className="text-4xl font-bold text-white max-w-2xl mx-auto leading-tight">Take the next big step for your agricultural business</h2>
            <p className="mt-6 text-zinc-400 max-w-md mx-auto">Our experts are here to guide you through every stage of the loan process.</p>
            <Link
              href="/services/check-eligibility?source=harvester"
              className="mt-12 inline-block rounded-full bg-white px-12 py-5 text-sm font-bold text-emerald-900 hover:bg-zinc-100 transition-all shadow-xl"
            >
              Check My Eligibility
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-12 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-zinc-400">© 2026 AgriBridge Financial Services. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-medium text-zinc-500">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

