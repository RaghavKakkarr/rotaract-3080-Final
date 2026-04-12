'use client';

import { 
  ArrowRight, ShieldCheck, Zap, Globe, Users, 
  MapPin, Heart, Target, Star, ChevronRight, Activity, Building, Award, Sparkles, History, Trophy
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const regions = ["Chandigarh", "Punjab", "Haryana", "Himachal Pradesh", "Uttarakhand", "Uttar Pradesh"];

  const featuredClubs = [
    { z: "Zone 1", n: "RAC Waknaghat", p: "Alisha Siddiqui", s: "Aamya Chauhan", r: "RC Shimla" },
    { z: "Zone 1", n: "RAC UCBS", p: "Rijul Sen", s: "Ayush Sharma", r: "RC Shimla Hill Queens" },
    { z: "Zone 1", n: "RAC Shimla Midtown", p: "Vidushi Gupta", s: "Janvi Chauhan", r: "Rotary Shimla Midtown" },
    { z: "Zone 1", n: "RAC Government Dental College", p: "Shivam Rai", s: "Priyanka Thakur", r: "Rotary Club Shimla" },
    { z: "Zone 1", n: "RAC HPLNU", p: "Ritik Jinata", s: "Sonia Singh Rana", r: "RC Shimla Midtown" },
    { z: "Zone 1", n: "RAC RKMV", p: "Rishika Pandey", s: "Mehak Sharma", r: "Rotary Shimla Midtown" },
    { z: "Zone 2", n: "Silvercity Midtown", p: "Prabhnoor Singh Bedi", s: "Diwanshu Wali", r: "RC Silvercity Mohali" },
    { z: "Zone 2", n: "Chandigarh", p: "Moin Khan", s: "Ishita Malik", r: "RC Chandigarh" },
    { z: "Zone 2", n: "RAC Homeopathic Med. Colg", p: "Astha Arora", s: "Sparsh Gambhir", r: "RC Silvercity Mohali" },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-32 pb-32 px-6 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* 🚀 1. HERO SECTION */}
        <section className="mb-40 relative min-h-[60vh] flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.5em] text-[12px] italic">
              Rotaract District 3080
            </span>
            <span className="text-neutral-400 dark:text-neutral-600 font-black uppercase tracking-[0.4em] text-[11px] italic">
              • People of Action
            </span>
          </div>

          <h1 className="text-6xl md:text-[110px] font-black italic uppercase tracking-tighter mb-10 leading-[0.82] text-neutral-900 dark:text-white">
            Build <span className="text-rose-600 dark:text-rose-500 text-not-italic font-sans">Leaders.</span> <br/>
            Serve Communities.
          </h1>

          <p className="text-xl md:text-3xl text-neutral-600 dark:text-neutral-400 max-w-5xl leading-relaxed font-medium italic mb-12">
            "The definitive digital ecosystem for <span className="text-neutral-900 dark:text-white font-bold not-italic decoration-rose-500/30">RID 3080</span>. 
            Cultivating leadership and fellowship across Northern India."
          </p>

          <div className="flex flex-wrap gap-6">
            <Link href="/clubs" className="bg-neutral-900 dark:bg-white text-white dark:text-black px-12 py-6 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-all shadow-2xl flex items-center gap-3">
              Explore Clubs <ArrowRight size={18} />
            </Link>
            <Link href="/council" className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-12 py-6 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] hover:border-rose-500 transition-all text-neutral-600 dark:text-white">
              Meet Council
            </Link>
          </div>
        </section>

        {/* 📊 2. CORE STATS */}
        <section className="mb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Established', val: '1984-85', ic: History },
              { label: 'Active Zones', val: '6 Zones', ic: MapPin },
              { label: 'Clubs Strength', val: '60+ Clubs', ic: Building },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-12 rounded-[3.5rem] hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-all shadow-sm">
                <s.ic className="text-rose-600 dark:text-rose-500 mb-8" size={36} />
                <p className="text-neutral-500 text-[11px] font-black uppercase tracking-widest mb-3">{s.label}</p>
                <h3 className="text-4xl font-black italic text-neutral-900 dark:text-white">{s.val}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 🗺️ 3. GEOGRAPHIC REACH */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40 items-center">
          <div className="space-y-10 text-left">
            <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter">District <span className="text-rose-600 dark:text-rose-500">Reach</span></h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium italic">
              Spanning across Northern India, 3080 creates a bridge between diverse cultures with a singular mission of service above self.
            </p>
            <div className="flex flex-wrap gap-4">
              {regions.map((r, i) => (
                <span key={i} className="px-6 py-3 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-300 shadow-sm hover:border-rose-500 transition-all">
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 aspect-video rounded-[4rem] flex items-center justify-center p-10 relative overflow-hidden group">
             <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000" className="w-full h-full object-cover rounded-[3rem] opacity-80 group-hover:scale-105 transition-all duration-1000" alt="District Action" />
          </div>
        </section>

        {/* 🏛️ 4. COUNCIL PREVIEW */}
        <section className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-16 md:p-24 rounded-[4.5rem] mb-40">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-16 text-center text-neutral-900 dark:text-white">Council <span className="text-rose-600 dark:text-rose-500">3080</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            {[
              { n: "Rtn. Dr. Rita Kalra", r: "District Governor" },
              { n: "PHF PP Rtr. Dr. Manu Gupta", r: "DRR" },
              { n: "Mohit Singla", r: "DRCC" },
              { n: "Shivansh Sharma", r: "District Youth Chair" },
              { n: "Yashika Sagar", r: "District Trainer" },
              { n: "Shubham Goyal", r: "DRCC Co-Chair" },
            ].map((lead, i) => (
              <div key={i} className="flex flex-col items-start border-l-2 border-neutral-200 dark:border-white/10 pl-8 relative group hover:border-rose-500 transition-colors">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-transform group-hover:scale-125"></div>
                <h4 className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white mb-2 leading-tight">{lead.n}</h4>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-600 dark:text-rose-500">{lead.r}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/council" className="bg-neutral-100 dark:bg-white/5 px-8 py-4 rounded-full text-neutral-500 hover:text-rose-500 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all inline-flex mx-auto border border-transparent hover:border-rose-500">
                View Official Council <ChevronRight size={14}/>
            </Link>
          </div>
        </section>

        {/* 🏆 5. IMPACT LEADERS */}
        <section className="mb-40">
          <div className="flex items-center gap-6 mb-12">
             <Trophy className="text-amber-500" size={40} />
             <h2 className="text-5xl font-black uppercase italic tracking-tighter text-neutral-900 dark:text-white">Impact <span className="text-amber-500 text-not-italic">Leaders</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {[
              { name: 'RAC Chandigarh Central', zone: '2', impact: '14,250' },
              { name: 'RAC Waknaghat', zone: '1', impact: '12,800' },
              { name: 'RAC Shimla Midtown', zone: '1', impact: '10,400' },
            ].map((club, index) => (
              <div key={index} className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-10 rounded-[3rem] flex items-center justify-between group hover:border-amber-500 transition-all shadow-sm">
                <div className="flex items-center gap-8">
                  <span className="text-4xl font-black italic text-neutral-200 dark:text-neutral-800">0{index + 1}</span>
                  <h4 className="text-2xl font-black uppercase text-neutral-900 dark:text-white group-hover:text-amber-500 transition-colors">{club.name}</h4>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black italic text-green-600 dark:text-green-500">{club.impact}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Beneficiaries</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🏢 6. FEATURED CLUBS - FIXED: Now respects Light/Dark Mode */}
        <section className="bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 p-16 md:p-24 rounded-[5rem] mb-40 relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute -top-10 -right-10 p-12 opacity-[0.03] dark:opacity-[0.03] text-neutral-900 dark:text-white -rotate-12"><Building size={400} /></div>
          <div className="relative z-10 text-center mb-16">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4 text-neutral-900 dark:text-white">District <span className="text-rose-600 dark:text-rose-500">Clubs</span></h2>
            <p className="text-neutral-500 dark:text-neutral-400 uppercase tracking-widest text-[11px] font-bold">Showcasing excellence across the territory</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {featuredClubs.map((club, i) => (
              <div key={i} className="bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-10 rounded-[3.5rem] hover:bg-neutral-100 dark:hover:bg-white/10 transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-rose-600 dark:text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest">{club.z}</span>
                    <Building size={20} className="text-neutral-300 dark:text-white/20 group-hover:text-rose-600 dark:group-hover:text-rose-500 transition-colors" />
                  </div>
                  <h4 className="text-2xl font-black italic mb-8 leading-tight uppercase text-neutral-900 dark:text-white">{club.n}</h4>
                </div>
                <div className="space-y-4 border-t border-neutral-200 dark:border-white/10 pt-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">President</p>
                      <p className="text-[11px] font-bold text-neutral-900 dark:text-white">{club.p}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">Secretary</p>
                      <p className="text-[11px] font-bold text-neutral-900 dark:text-white">{club.s}</p>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                    <p className="text-[9px] text-rose-600 dark:text-rose-500 uppercase font-black tracking-widest">Sponsor</p>
                    <p className="text-[10px] font-bold italic text-neutral-600 dark:text-neutral-300">{club.r}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/clubs" className="inline-flex items-center gap-4 bg-neutral-900 dark:bg-rose-600 text-white px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-rose-600 dark:hover:bg-rose-500 transition-all shadow-xl">
                Browse Full Club Directory <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* 📞 7. FINAL CTA */}
        <section className="text-center py-20">
          <h2 className="text-6xl md:text-[100px] font-black italic uppercase tracking-tighter leading-none mb-12 text-neutral-900 dark:text-white">
            Service with <span className="text-rose-600 dark:text-rose-500 text-not-italic font-sans">Purpose.</span>
          </h2>
          <Link href="/contact" className="bg-neutral-900 dark:bg-white text-white dark:text-black px-16 py-8 rounded-full font-black uppercase text-[12px] tracking-[0.4em] shadow-[0_20px_50px_rgba(244,63,94,0.3)] hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-all inline-block hover:-translate-y-2">
            Connect With Us
          </Link>
        </section>

      </div>
    </main>
  );
}