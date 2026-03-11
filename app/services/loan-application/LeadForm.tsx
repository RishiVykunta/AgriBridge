"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { submitLoanApplication } from "@/app/actions/applications";

export default function LeadForm({ session }: { session: any }) {
  const searchParams = useSearchParams();
  const loanTypeFromUrl = searchParams.get("type");
  const loanType = loanTypeFromUrl === "harvester" ? "Harvester" : "Tractor";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("type", loanType);
    if (session?.user?.id) {
      formData.append("userId", session.user.id);
    }

    const result = await submitLoanApplication(formData);
    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      alert("Submission failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[40px] bg-white p-12 text-center shadow-2xl animate-in fade-in zoom-in duration-500 border border-zinc-100">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-5xl shadow-inner mb-8">
          ✅
        </div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Application Received</h2>
        <p className="mt-4 text-zinc-500 max-w-sm mx-auto text-lg leading-relaxed">
          Thank you, <span className="text-emerald-600 font-bold">{session?.user?.name || "Farmer"}</span>. 
          Our verified partner banks will review your profile and contact you within 
          <span className="font-bold text-zinc-900"> 24 business hours</span>.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = "/dashboard"}
              className="rounded-2xl bg-zinc-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition-all shadow-xl shadow-zinc-900/10"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => window.location.href = "/"}
              className="rounded-2xl border border-zinc-200 px-8 py-4 text-xs font-black uppercase tracking-widest text-zinc-900 hover:bg-zinc-50 transition-all"
            >
              Back Home
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[40px] bg-white p-8 shadow-2xl lg:p-12 border border-zinc-100">
      <div className="mb-10 flex items-center justify-between border-b border-zinc-100 pb-8">
        <div>
           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 block animate-pulse">Official Partner Application</span>
           <h2 className="text-4xl font-black text-zinc-900 tracking-tight">{loanType} Loan Request</h2>
           <p className="text-zinc-400 text-sm mt-1 font-medium italic">Powered by AgriBridge Certified Banking Partners</p>
        </div>
        <div className="hidden sm:block">
           <div className="p-1 rounded-3xl bg-emerald-50 shadow-inner ring-4 ring-emerald-500/5">
             <img 
               src={loanType === "Harvester" ? "https://res.cloudinary.com/dqcxekzxn/image/upload/v1773167600/A_cinematic_shot_of_a_harvester_symbolizing_efficiency_and_growth._r06lxv.jpg" : "https://res.cloudinary.com/dqcxekzxn/image/upload/v1773167600/Tractor_Loan_Hero__A_professional_prosperous_scene_of_a_modern_tractor_tvanqn.jpg"} 
               className="h-20 w-20 rounded-2xl object-cover shadow-lg" 
               alt="Loan Product" 
             />
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Personal Details */}
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-l-[6px] border-emerald-500 pl-4 py-1">Personal Information</h3>
            
            <div className="group space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 ml-1 group-focus-within:text-emerald-600 transition-colors">Full Name (as per Aadhar)</label>
              <input
                required
                name="name"
                defaultValue={session?.user?.name || ""}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                placeholder="Enter your full name"
              />
            </div>

            <div className="group space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 ml-1 group-focus-within:text-emerald-600 transition-colors">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-bold border-r border-zinc-200 pr-3">+91</span>
                <input
                  required
                  name="phone"
                  type="tel"
                  defaultValue={session?.user?.phone || ""}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-20 pr-6 py-4.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                  placeholder="XXXXXXXXXX"
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 ml-1 group-focus-within:text-emerald-600 transition-colors">Email Address</label>
              <input
                required
                name="email"
                type="email"
                defaultValue={session?.user?.email || ""}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-l-[6px] border-emerald-500 pl-4 py-1">Financial Intelligence</h3>
            
            <div className="group space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 ml-1 group-focus-within:text-emerald-600 transition-colors">Annual Agricultural Income (₹)</label>
              <input
                required
                name="income"
                type="number"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                placeholder="e.g. 5,00,000"
              />
            </div>

            <div className="group space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 ml-1 group-focus-within:text-emerald-600 transition-colors">Land Size (Total Acres)</label>
              <input
                name="landSize"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                placeholder="e.g. 10 Acres"
              />
            </div>

            <div className="group space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 ml-1 group-focus-within:text-emerald-600 transition-colors">Requested Amount (₹)</label>
              <input
                required
                name="loanAmount"
                type="number"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-zinc-300 shadow-sm"
                placeholder="e.g. 15,00,000"
              />
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-100 flex flex-col items-center">
          <div className="flex items-start gap-4 mb-8 max-w-lg">
             <input required type="checkbox" id="consent" className="mt-1 h-5 w-5 rounded-lg border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-500 transition-all" />
             <label htmlFor="consent" className="text-xs text-zinc-400 font-medium leading-relaxed select-none cursor-pointer">
               I authorize AgriBridge to share my details with certified bank partners and understand that this is a premium application route with accelerated processing.
             </label>
          </div>
          
          <button
            disabled={isSubmitting}
            className="w-full max-w-md rounded-[32px] bg-zinc-900 py-6 text-sm font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center h-[68px]"
          >
            {isSubmitting ? (
              <svg className="w-6 h-6 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : "Request Professional Recall"}
          </button>
          
          <div className="mt-8 flex items-center gap-6 opacity-30 grayscale contrast-200 pointer-events-none">
             <span className="text-[10px] font-black tracking-widest uppercase">Verified Partners:</span>
             <div className="flex gap-4 items-center">
                <div className="h-4 w-12 bg-zinc-400 rounded" />
                <div className="h-4 w-12 bg-zinc-400 rounded" />
                <div className="h-4 w-12 bg-zinc-400 rounded" />
             </div>
          </div>
        </div>
      </form>
    </div>
  );
}
