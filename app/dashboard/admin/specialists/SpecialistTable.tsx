"use client";

import { updateSpecialistStatus, markSpecialistAsRead } from "@/app/actions/applications";
import { useState } from "react";

export default function SpecialistTable({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateSpecialistStatus(id, newStatus);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, isRead: true } : r));
  };

  const handleMarkRead = async (id: string) => {
    await markSpecialistAsRead(id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, isRead: true } : r));
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/50">
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Farmer Details</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Crop Focus</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Request Date</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {requests.map((req) => (
            <tr key={req.id} className={`group hover:bg-zinc-50/50 transition-colors ${!req.isRead ? "bg-emerald-50/30" : ""}`}>
              <td className="px-8 py-6">
                <div className="font-bold text-zinc-900">{req.name}</div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">{req.phone}</div>
              </td>
              <td className="px-8 py-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                   {req.cropType || "General Advice"}
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="text-xs font-bold text-zinc-600">
                  {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="text-[10px] text-zinc-400 font-medium mt-0.5">
                  {new Date(req.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </td>
              <td className="px-8 py-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  req.status === "NEW" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  req.status === "CONTACTED" ? "bg-amber-50 text-amber-700 border-amber-100" :
                  "bg-zinc-50 text-zinc-500 border-zinc-100"
                }`}>
                  {req.status}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  {!req.isRead && (
                    <button 
                      onClick={() => handleMarkRead(req.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-4"
                    >
                      Mark Read
                    </button>
                  )}
                  <select 
                    value={req.status}
                    className="text-[10px] font-black uppercase tracking-widest bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                  >
                     <option value="NEW">NEW</option>
                     <option value="CONTACTED">CONTACTED</option>
                     <option value="COMPLETED">COMPLETED</option>
                     <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {requests.length === 0 && (
        <div className="p-20 text-center">
           <div className="text-4xl mb-4 text-zinc-200">🌱</div>
           <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No specialist consultations in queue</div>
        </div>
      )}
    </div>
  );
}
