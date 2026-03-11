import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";

export default async function ServicesPage() {
  const session = await getSession();
  const isAdmin = session?.roles.some(r => r.role === "ADMIN");

  const services = [
    {
      title: "Tractor Loans",
      description: "Fast financing for new and used tractors. Competitive rates and flexible repayment schedules tailored to your harvest cycle.",
      link: "/services/tractor-loan",
      image: "/images/loans/tractor_loan.png",
      color: "emerald",
      icon: "🚜"
    },
    {
      title: "Harvester Loans",
      description: "Upgrade to high-performance harvesting equipment. Special schemes for custom hiring centers and agricultural cooperatives.",
      link: "/services/harvester-loan",
      image: "/images/loans/harvester_loan.png",
      color: "amber",
      icon: "🌾"
    },
    {
      title: "Equipment Finance",
      description: "Specialized loans for tillers, rotavators, and other essential implements. Empower your farm with modern technology.",
      link: "/services/loan-application?type=equipment",
      image: "/images/loans/tractor_loan.png",
      color: "zinc",
      icon: "🛠️"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-800">AgriBridge</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors">
              Home
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

      <main className="flex-1 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
              Financial Solutions
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
              Empowering Indian Agriculture with <span className="text-emerald-600">Smart Finance</span>
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed">
              We provide competitive credit solutions to help farmers and agribusinesses scale their productivity with modern machinery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <Link 
                key={i} 
                href={service.link}
                className="group relative bg-white rounded-[40px] border border-zinc-200 p-8 hover:border-emerald-500 hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-4xl opacity-10 group-hover:scale-125 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-zinc-900 mb-4 group-hover:text-emerald-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed mb-8">
                  {service.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:gap-4 transition-all">
                  <span>Explore Details</span>
                  <span className="text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Partner Highlight */}
          <div className="mt-32 p-12 bg-white rounded-[40px] border border-zinc-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Partnered with SBI</h2>
              <p className="text-zinc-500">AgriBridge collaborates with the State Bank of India to offer the lowest interest rates and fastest loan processing for our verified members.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 px-6 py-4 rounded-2xl">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Interest Rate</p>
                <p className="text-2xl font-black text-emerald-900">8.5% p.a.</p>
              </div>
              <div className="bg-emerald-50 px-6 py-4 rounded-2xl">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Approval Time</p>
                <p className="text-2xl font-black text-emerald-900">24-48 Hrs</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-12 bg-white mt-20">
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
