"use client";

import { updateLoanStatus, markLoanAsRead } from "@/app/actions/applications";
import { useState } from "react";

export default function LoanTable({ initialLoans }: { initialLoans: any[] }) {
  const [loans, setLoans] = useState(initialLoans);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateLoanStatus(id, newStatus);
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status: newStatus, isRead: true } : l));
  };

  const handleMarkRead = async (id: string) => {
    await markLoanAsRead(id);
    setLoans(prev => prev.map(l => l.id === id ? { ...l, isRead: true } : l));
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/50">
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Applicant</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Type & Amount</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Financials</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {loans.map((loan) => (
            <tr key={loan.id} className={`group hover:bg-zinc-50/50 transition-colors ${!loan.isRead ? "bg-emerald-50/30" : ""}`}>
              <td className="px-8 py-6">
                <div className="font-bold text-zinc-900">{loan.name}</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">{loan.phone}</div>
                <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-tighter">{loan.email}</div>
              </td>
              <td className="px-8 py-6">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1.5">
                   {loan.type}
                </div>
                <div className="text-sm font-black text-zinc-900">
                  ₹{Number(loan.loanAmount)?.toLocaleString() || "—"}
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="text-xs font-bold text-zinc-600">Income: ₹{Number(loan.income)?.toLocaleString() || "—"}</div>
                <div className="text-[10px] text-zinc-400 font-bold mt-1 uppercase italic">Land: {loan.landSize || "—"}</div>
              </td>
              <td className="px-8 py-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  loan.status === "NEW" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  loan.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border-amber-100" :
                  "bg-zinc-50 text-zinc-500 border-zinc-100"
                }`}>
                  {loan.status}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  {!loan.isRead && (
                    <button 
                      onClick={() => handleMarkRead(loan.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-4"
                    >
                      Mark Read
                    </button>
                  )}
                  <select 
                    value={loan.status}
                    className="text-[10px] font-black uppercase tracking-widest bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    onChange={(e) => handleStatusChange(loan.id, e.target.value)}
                  >
                     <option value="NEW">NEW</option>
                     <option value="IN_PROGRESS">IN_PROGRESS</option>
                     <option value="APPROVED">APPROVED</option>
                     <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loans.length === 0 && (
        <div className="p-20 text-center">
           <div className="text-4xl mb-4 text-zinc-200">📭</div>
           <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No applications found in the pipeline</div>
        </div>
      )}
    </div>
  );
}
