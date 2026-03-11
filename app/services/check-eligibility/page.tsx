import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function EligibilityCheckerPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const session = await getSession();
  const { source } = await searchParams;

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 z-50">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold text-emerald-800">AgriBridge</Link>
          <Link href={`/services/${source === 'harvester' ? 'harvester-loan' : 'tractor-loan'}`} className="text-sm font-medium text-zinc-500 hover:text-emerald-600">
            Exit Checker
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pt-32 pb-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6">
            Instant Assessment
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-6">
            Check Your <span className="text-emerald-600">Borrowing Power</span>
          </h1>
          <p className="text-lg text-zinc-500 mb-12">
            Professional evaluation based on your land size, crop cycle, and income. No impact on credit score.
          </p>

          <div className="bg-zinc-50 rounded-[40px] p-8 md:p-12 border border-zinc-100 shadow-sm text-left">
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Income */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide">Monthly Farm Income</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 50,000"
                      className="w-full bg-white rounded-2xl border border-zinc-200 pl-10 pr-4 py-4 text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Land Size */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide">Land Holding (Acres)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5"
                    className="w-full bg-white rounded-2xl border border-zinc-200 px-4 py-4 text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                  />
                </div>
              </div>

              {/* Loan Amount */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide">Desired Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
                  <input 
                    type="number" 
                    placeholder="e.g. 10,00,000"
                    className="w-full bg-white rounded-2xl border border-zinc-200 pl-10 pr-4 py-4 text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                  />
                </div>
              </div>

              {/* Existing Obligations */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-wide">Current Monthly EMI Pay-out</label>
                <input 
                  type="number" 
                  placeholder="₹ 0"
                  className="w-full bg-white rounded-2xl border border-zinc-200 px-4 py-4 text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                />
              </div>

              <button 
                type="button"
                className="w-full bg-zinc-900 text-white font-bold py-5 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-zinc-900/10 text-lg uppercase tracking-widest mt-4"
              >
                Calculate Eligibility
              </button>
            </form>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Partner Bank", val: "SBI Bank" },
              { label: "Interest Rate", val: "8.5%*" },
              { label: "Term", val: "Up to 7 Yrs" },
              { label: "Processing", val: "24-48 Hrs" }
            ].map((stat, i) => (
              <div key={i} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter mb-1">{stat.label}</p>
                <p className="text-lg font-black text-emerald-900">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
