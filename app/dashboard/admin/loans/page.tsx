import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LoanTable from "./LoanTable";

export default async function AdminLoansPage() {
  const loans = await prisma.loanApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#fafafa] p-8 md:p-12">
      <header className="mb-12 flex items-center justify-between">
        <div>
           <Link href="/dashboard/admin" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors mb-2 block">← Back to Center</Link>
           <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">Loan Pipeline</h1>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-zinc-900/20">
           <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
           {loans.length} Total Requests
        </div>
      </header>

      <LoanTable initialLoans={loans} />
    </div>
  );
}
