'use client';

import { 
  MapPin, Target, History, Award, Globe, 
  ShieldCheck, Heart, Sparkles, Star, Rocket, Quote,
  Users 
} from 'lucide-react';

export default function AboutPage() {
  const regions = ["Chandigarh", "Punjab", "Haryana", "Himachal Pradesh", "Uttarakhand", "Uttar Pradesh"];

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-32 pb-32 px-6 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* 🚀 HERO SECTION */}
        <section className="mb-32">
          <p className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic">
            • more than just a district
          </p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
            The Legacy of <span className="text-rose-600 dark:text-rose-500 text-not-italic">3080</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-4xl leading-relaxed font-medium italic">
            "We are a powerhouse of young leaders across Northern India, carrying a legacy of service that spans over four decades. From the foothills of the Himalayas to the plains of Uttar Pradesh, our impact is borderless."
          </p>
        </section>

        {/* 🏛️ THE ROTARY LEGACY - LOCAL PHOTO FIX */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 p-12 rounded-[4rem]">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <Star size={24} fill="currentColor" />
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Home of <span className="text-amber-500">Global Leadership</span></h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium italic">
              District 3080 holds the unique distinction of being the home district of <span className="text-neutral-900 dark:text-white font-bold">PRIP Rajendra K. Saboo</span>, who served as the Rotary International President in 1991-92. 
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium italic">
              Unki journey 1980s se shuru hui aur aaj wo global Rotary movement ke sabse bade faces mein se ek hain. Chandigarh se nikal kar puri duniya mein service ka danka bajane wale Raja Saboo sir RID 3080 ki sacchi pehchan hain.
            </p>
          </div>
          
          {/* LOCAL Photo Block */}
          <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-[3rem] relative overflow-hidden group border border-neutral-200 dark:border-white/10 shadow-2xl">
            <img 
              src="/rk-saboo.jpg" 
              alt="PRIP Rajendra K. Saboo" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
            />
            <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/75 backdrop-blur-md rounded-2xl border border-white/10">
               <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">District Pillar</p>
               <p className="text-xs font-bold italic text-white leading-tight">"Look Beyond Yourself" — PRIP R.K. Saboo</p>
            </div>
          </div>
        </section>

        {/* 🎯 CORE PHILOSOPHY */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">The Four <span className="text-rose-600">Pillars</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: 'Fellowship', d: 'Building lifelong friendships across borders through cultural and social exchange.', ic: Users },
              { t: 'Integrity', d: 'Adhering to the highest ethical standards in all professional and personal actions.', ic: ShieldCheck },
              { t: 'Service', d: 'Identifying community needs and executing sustainable impact projects.', ic: Heart },
              { t: 'Leadership', d: 'Developing skills to lead teams and influence positive change in society.', ic: Rocket },
            ].map((p, i) => (
              <div key={i} className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-10 rounded-[3rem] hover:-translate-y-2 transition-all duration-500">
                <p.ic className="text-rose-600 mb-6" size={32} />
                <h3 className="text-xl font-black uppercase italic mb-3">{p.t}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🗺️ GEOGRAPHIC FOOTPRINT */}
        <section className="mb-32">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter">Our <span className="text-rose-600">Footprint</span></h2>
              <div className="space-y-6">
                <p className="text-neutral-600 dark:text-neutral-400 text-lg italic leading-relaxed">
                  Our territory is one of the most geographically diverse in the Rotary world, connecting urban hubs with remote mountain communities.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {regions.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className="w-2 h-2 bg-rose-500 rounded-full group-hover:scale-150 transition-all"></div>
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-300">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full aspect-video bg-neutral-900 rounded-[4rem] relative overflow-hidden border border-white/5 flex items-center justify-center">
               <Globe size={180} className="text-white/10 opacity-20" />
               <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-black italic">3000+</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Active Rotaractors</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 🏺 THE JOURNEY */}
        <section className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-12 md:p-24 rounded-[4.5rem]">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-20 text-center">Chronicles of <span className="text-rose-600">Impact</span></h2>
          <div className="max-w-4xl mx-auto space-y-16">
            {[
              { year: '1984', title: 'The Genesis', desc: 'District 3080 was carved out with a vision to streamline service in Northern India.' },
              { year: '1991', title: 'The Golden Year', desc: 'Rtn. Raja Saboo takes office as RI President, setting global standards from RID 3080.' },
              { year: '2000s', title: 'Sustainable Era', desc: 'Focus shifts towards long-term community impact and large-scale medical missions.' },
              { year: '2026+', title: 'Digital Evolution', desc: 'Embracing data and technology to amplify volunteer impact across the district.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-8 md:gap-16 border-l-2 border-neutral-200 dark:border-white/10 pl-10 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.6)]"></div>
                <div className="w-24 shrink-0">
                  <span className="text-3xl font-black italic text-rose-600 dark:text-rose-500">{step.year}</span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black uppercase italic tracking-tight text-neutral-900 dark:text-white">{step.title}</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed italic">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}