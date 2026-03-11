"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product as UiProduct } from "./ProductSection";
import { submitSpecialistConsultation } from "@/app/actions/applications";

type Props = {
  sectionLabel: string;
  categoryLabel: string;
  categories: { label: string; href: string }[];
  /** Optional: products to show in the grid on the right */
  products?: UiProduct[];
  /** Whether the current user is logged in (for ProductCard actions) */
  isLoggedIn?: boolean;
  /** Optional list of brand names to show in the Brands filter */
  brands?: string[];
  /** Optional: customized hero image for the category */
  heroImage?: string;
  /** Optional: customized description for the category */
  description?: string;
};

export function CategoryListingLayout({
  sectionLabel,
  categoryLabel,
  categories,
  products = [],
  isLoggedIn,
  brands = [],
  heroImage,
  description,
}: Props) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const clearFilters = () => setSelectedBrands([]);

  const filteredProducts = products.filter(p => 
    selectedBrands.length === 0 || selectedBrands.includes(p.brand)
  );

  const handleSupportClick = () => {
    setIsModalOpen(true);
    setSubmitted(false);
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      cropType: formData.get("cropType") as string,
    };

    const result = await submitSpecialistConsultation(data);
    setIsSubmitting(false);
    
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => setIsModalOpen(false), 2000);
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Dynamic Hero Section */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden bg-zinc-900">
        {heroImage ? (
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt={categoryLabel} 
              className="h-full w-full object-cover opacity-60 brightness-75 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-emerald-950 opacity-40">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(16,185,129,0.15)_0%,_transparent_70%)]" />
          </div>
        )}
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex flex-col justify-center">
          <Link href="/services" className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 hover:text-emerald-300 transition-colors">
            <span className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">{sectionLabel}</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {categoryLabel}
          </h1>
          {description && (
            <p className="mt-4 text-zinc-200 max-w-2xl text-lg leading-relaxed font-medium">
              {description}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-6 border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-3">
             <div className="h-10 w-1 bg-emerald-500 rounded-full" />
             <p className="text-sm font-bold text-zinc-500 uppercase tracking-tighter">
               Curated Professionals Catalog
             </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-600">Sort By :</span>
            <select className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <option>Best Selling</option>
              <option>Customer Rating: 4★ and above</option>
              <option>Price: Low to High</option>
              <option>Price: High to low</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          {/* Filters */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <section className="space-y-4">
                <button className="flex w-full items-center justify-between text-left">
                  <span className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Categories</span>
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-400 group-hover:text-emerald-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </button>
                <div className="max-h-60 overflow-auto pr-2 custom-scrollbar">
                  <ul className="space-y-2">
                    {categories.map((c) => {
                       const isActive = c.label === categoryLabel;
                       return (
                        <li key={`${c.href}::${c.label}`}>
                          <Link 
                            href={c.href} 
                            className={`block px-3 py-2 rounded-xl text-sm transition-all ${
                              isActive 
                                ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-sm" 
                                : "text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600"
                            }`}
                          >
                            {c.label}
                          </Link>
                        </li>
                       );
                    })}
                  </ul>
                </div>
              </section>

              {/* Brands */}
              <section className="pt-6 mt-6 border-t border-zinc-100 space-y-4">
                <button className="flex w-full items-center justify-between text-left">
                  <span className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Selected Brands</span>
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {brands && brands.length > 0 ? (
                  <div className="max-h-48 overflow-auto pr-2 custom-scrollbar space-y-2 pt-2">
                    {brands.map((b: string) => (
                      <label key={b} className="flex items-center gap-3 group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b)}
                          onChange={() => toggleBrand(b)}
                          className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                        />
                        <span className={`text-sm tracking-tight font-medium transition-colors uppercase ${
                          selectedBrands.includes(b) ? "text-emerald-700 font-bold" : "text-zinc-600 group-hover:text-zinc-900"
                        }`}>
                          {b}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No brand filters available</p>
                )}
              </section>

              {/* Price Range */}
              <section className="pt-6 mt-6 border-t border-zinc-100 space-y-4">
                <span className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Investment Range</span>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">Min (₹)</span>
                      <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                        <option>0</option>
                        <option>500</option>
                        <option>1,000</option>
                        <option>5,000</option>
                      </select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">Max (₹)</span>
                      <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                        <option>10,000</option>
                        <option>50,000</option>
                        <option>1,00,000+</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Support Box */}
            <div className="rounded-3xl bg-emerald-900 p-6 text-white shadow-xl shadow-emerald-900/20">
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">Expert Consultation</span>
               <h4 className="text-lg font-bold mb-2">Need Guidance?</h4>
               <p className="text-sm text-emerald-100/70 mb-4 leading-snug">Our agricultural scientists are here to help you choose the right nutrition for your crop.</p>
               <button 
                  onClick={handleSupportClick}
                  className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest"
               >
                  Talk to Specialist
               </button>
            </div>
          </aside>

          {/* Product grid */}
          <main>
            {filteredProducts.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500 font-medium">
                    Showing{" "}
                    <span className="font-black text-zinc-900">
                      {filteredProducts.length}
                    </span>{" "}
                    premium products
                  </p>
                  {selectedBrands.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                        {selectedBrands.map(b => (
                           <span key={b} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                              {b}
                              <button onClick={() => toggleBrand(b)} className="hover:text-emerald-900">×</button>
                           </span>
                        ))}
                     </div>
                  )}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.productId ?? `${p.name}::${p.brand}`}
                      name={p.name}
                      brand={p.brand}
                      prices={p.prices}
                      cutPrice={p.cutPrice}
                      save={p.save}
                      discount={p.discount}
                      image={p.image}
                      availability={p.availability}
                      description={p.description}
                      href={p.href}
                      productId={p.productId}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[40px] border border-zinc-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-2xl mb-6">🔍</div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
                <p className="text-zinc-500 max-w-sm mx-auto mb-8">
                  We couldn't find any products matching your current filters. Try selecting different brands or clear all filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-zinc-900 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all"
                >
                   Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Consultation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[40px] bg-white shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
             <div className="bg-emerald-900 p-8 text-white relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-6 top-6 text-emerald-100/50 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">Premium Support</span>
                <h3 className="text-2xl font-black tracking-tight">Expert Consultation</h3>
                <p className="mt-2 text-emerald-100/70 text-sm leading-relaxed">
                  Connect with our lead agricultural scientists for personalized crop nutrition strategies.
                </p>
             </div>

             <div className="p-8">
                {submitted ? (
                  <div className="py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner">
                      ✅
                    </div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-2">Request Received!</h4>
                    <p className="text-zinc-500">Our specialist will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleModalSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                      <input 
                        required
                        name="name"
                        type="text" 
                        placeholder="e.g. Arasa Kumar"
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number</label>
                      <input 
                        required
                        name="phone"
                        type="tel" 
                        placeholder="+91-XXXXX-XXXXX"
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Crop Type</label>
                      <input 
                        name="cropType"
                        type="text" 
                        placeholder="e.g. Paddy, Cotton, Wheat"
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                      />
                    </div>
                    
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 transition-all text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 disabled:opacity-50 mt-4 h-[52px] flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : "Confirm Request"}
                    </button>
                    <p className="text-[10px] text-zinc-400 text-center font-medium">By submitting, you agree to our privacy policy and data handling.</p>
                  </form>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

