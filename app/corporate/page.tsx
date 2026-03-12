import Link from "next/link";
import { Leaf, Globe, Rocket, Shield, Mail, Phone, MapPin, Heart } from "lucide-react";
import { HomeHeaderServer } from "@/app/components/HomeHeaderServer";

export default function CorporateSite() {
  return (
    <div className="min-h-screen bg-white">
      <HomeHeaderServer />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/corporate_visionary_realistic_1773348620182.png" 
            alt="AgriBridge Corporate" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/40"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl">
            Agri<span className="text-emerald-400">Bridge</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-white font-medium tracking-widest uppercase">
            Cultivating the Future of Trade
          </p>
          <div className="mt-12 w-24 h-1 bg-emerald-500 mx-auto"></div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-6">Our Mission</h2>
          <p className="text-3xl md:text-5xl font-black text-zinc-900 leading-[1.2]">
            We are building the digital backbone of the global agricultural economy, 
            connecting the farm-gate directly to the consumer's plate.
          </p>
          <p className="mt-12 text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            AgriBridge isn't just a marketplace; it's a commitment to efficiency, 
            sustainability, and the prosperity of those who feed the world.
          </p>
        </div>
      </section>

      {/* Core Values - Modern Cards */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                icon: <Rocket size={28} />, 
                title: "Innovation", 
                desc: "Harnessing AI and data to optimize crop cycles and market pricing." 
              },
              { 
                icon: <Shield size={28} />, 
                title: "Integrity", 
                desc: "Unwavering commitment to transparency in every transaction." 
              },
              { 
                icon: <Globe size={28} />, 
                title: "Impact", 
                desc: "Reducing food waste and improving the livelihoods of 10,000+ farmers." 
              },
              { 
                icon: <Leaf size={28} />, 
                title: "Sustainability", 
                desc: "Promoting organic practices and ethical sourcing across the network." 
              }
            ].map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-[2rem] shadow-sm border border-zinc-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-4">{v.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-32 bg-emerald-600 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-96 h-96 border-4 border-white rounded-full"></div>
           <div className="absolute bottom-10 right-10 w-64 h-64 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-20 tracking-tight">Our 2026 Global Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {[
              { label: "CO2 Offset", val: "50k Tons" },
              { label: "Rural Income Growth", val: "+45%" },
              { label: "Market Access Points", val: "2,500" },
              { label: "Pure Organic Reach", val: "1M+ Acres" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl md:text-6xl font-black mb-2">{stat.val}</p>
                <div className="w-12 h-1 bg-white/30 mx-auto mb-4"></div>
                <p className="text-sm font-bold uppercase tracking-widest text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Placeholder */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-black text-zinc-900 mb-8 tracking-tight">Get in Touch</h2>
              <p className="text-xl text-zinc-500 mb-12 font-medium">For media enquiries, investment opportunities, or strategic partnerships.</p>
              
              <div className="space-y-10">
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-600 group-hover:text-white transition-all cursor-pointer">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 uppercase text-xs tracking-widest mb-1">Email Our HQ</h4>
                    <p className="text-lg font-bold text-zinc-500">corporate@agribridge.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-600 group-hover:text-white transition-all cursor-pointer">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 uppercase text-xs tracking-widest mb-1">Corporate Hotline</h4>
                    <p className="text-lg font-bold text-zinc-500">+91 080 4567 8900</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-600 group-hover:text-white transition-all cursor-pointer">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 uppercase text-xs tracking-widest mb-1">Our Residence</h4>
                    <p className="text-lg font-bold text-zinc-500">Innovation Park, Sector 44, Bengaluru, India</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full h-[600px] rounded-[3rem] bg-zinc-100 overflow-hidden relative border-8 border-white shadow-2xl">
               <img 
                 src="/corporate_visionary_realistic_1773348620182.png" 
                 className="w-full h-full object-cover blur-sm opacity-60 scale-125"
                 alt="Contact Background"
               />
               <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[2rem] text-center shadow-2xl border border-white/50 w-full">
                     <Heart className="text-red-500 mx-auto mb-6" size={48} fill="currentColor" />
                     <h3 className="text-3xl font-black text-zinc-900 mb-4">Together, We Grow.</h3>
                     <p className="text-zinc-600 mb-8 font-medium">Interested in joining our mission? We're always looking for visionary talent.</p>
                     <Link href="#" className="inline-block bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all">
                        View Careers
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-emerald-500 rounded-lg"></div>
             <p className="text-xl font-black tracking-tighter">AgriBridge</p>
          </div>
          <p className="text-zinc-500 font-medium text-sm">© 2026 AgriBridge Corporate Group. Excellence in Agriculture.</p>
          <div className="flex gap-8 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/sell" className="hover:text-white transition-colors">Selling</Link>
            <Link href="/bulk-orders" className="hover:text-white transition-colors">B2B</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
