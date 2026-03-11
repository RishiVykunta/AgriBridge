import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";

export default async function TractorLoanPage() {
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
              src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1773167600/Tractor_Loan_Hero__A_professional_prosperous_scene_of_a_modern_tractor_tvanqn.jpg" 
              alt="Professional Tractor" 
              fill 
              className="object-cover brightness-[0.7] transform scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-100 text-xs font-bold uppercase tracking-widest backdrop-blur-sm border border-emerald-500/30">
                Financial Services
              </span>
              <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
                Empower Your Farm with <span className="text-emerald-400">Tractor Loans</span>
              </h1>
              <p className="mt-6 text-xl text-zinc-200 leading-relaxed max-w-xl">
                Get the machinery you need with flexible financing solutions tailored for India's hardworking farmers. Partnered with top-tier banks like SBI.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/services/loan-application?type=tractor"
                  className="rounded-full bg-emerald-500 px-8 py-4 text-sm font-bold text-white hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Proceed to Application
                </Link>
                <Link
                  href="#details"
                  className="rounded-full bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-bold text-white hover:bg-white/20 border border-white/30 transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section id="details" className="py-24 bg-zinc-50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-zinc-900">Why choose AgriBridge?</h2>
              <p className="mt-4 text-zinc-500 max-w-2xl mx-auto italic font-medium">
                We simplify the borrowing process so you can focus on what matters most—your harvest.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: "Fast Processing", desc: "Get your eligibility checked within 24 hours of successful document submission.", icon: "⚡" },
                { title: "Low Interest Rates", desc: "Competitive rates starting from 8.5% p.a. in partnership with national banks.", icon: "📉" },
                { title: "Minimal Paperwork", desc: "Digital first approach for all your documentation and identity verification.", icon: "📄" },
              ].map((item, i) => (
                <div key={i} className="group bg-white p-10 rounded-3xl border border-zinc-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-xl">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
                  <p className="mt-4 text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
                  <Image 
                    src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1773167600/Tractor_Loan_Hero__A_professional_prosperous_scene_of_a_modern_tractor_tvanqn.jpg" 
                    alt="Process" 
                    width={600} 
                    height={400} 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-emerald-900/10 active:bg-transparent"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-12">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900">Application Requirements</h2>
                  <p className="mt-4 text-zinc-600">Keep these documents ready for a smooth and uninterrupted application experience.</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                       Personal ID
                    </h4>
                    <ul className="space-y-2 text-sm text-zinc-500 font-medium">
                      <li>• Aadhaar Card / PAN Card</li>
                      <li>• Recent Passport Size Photos</li>
                      <li>• Active Phone Number</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                       Farm Details
                    </h4>
                    <ul className="space-y-2 text-sm text-zinc-500 font-medium">
                      <li>• Land Revenue Records</li>
                      <li>• Income Proof (Last 6 Months)</li>
                      <li>• Existing Loan Statements (if any)</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-100 flex items-center justify-between">
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Preferred Partner: SBI</p>
                  <Link href="/services" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
                    Explore Other Loans →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-zinc-900 py-20 mx-6 mb-12 rounded-[40px] text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 px-6">
            <h2 className="text-3xl font-bold text-white">Ready to grow your productivity?</h2>
            <p className="mt-4 text-zinc-400 max-w-md mx-auto">Join thousands of farmers who have modernized their farms through AgriBridge.</p>
            <Link
              href="/services/check-eligibility?source=tractor"
              className="mt-10 inline-block rounded-full bg-emerald-500 px-10 py-4 text-sm font-bold text-white hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
            >
              Check My Eligibility
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-12 bg-white">
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

