'use client';

import { MapPin, Target, History, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  const regions = ["Chandigarh", "Punjab", "Haryana", "Himachal Pradesh", "Uttarakhand", "Uttar Pradesh"];

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HERO SECTION */}
        <section className="mb-24">
          <p className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic">
            • district identity and reach
          </p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
            About <span className="text-rose-500 text-not-italic">3080</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed font-medium italic">
            "We empower youth to develop leadership skills, foster responsible citizenship, and engage in meaningful service initiatives."
          </p>
        </section>

        {/* CORE STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            { label: 'Established', val: '1984-85', ic: History },
            { label: 'Active Zones', val: '6 Zones', ic: MapPin },
            { label: 'Legacy Home', val: 'PRIP R.K. Saboo', ic: Award },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:bg-white/[0.08] transition-all">
              <s.ic className="text-rose-500 mb-6" size={32} />
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-2">{s.label}</p>
              <h3 className="text-3xl font-black italic">{s.val}</h3>
            </div>
          ))}
        </div>

        {/* GEOGRAPHIC REACH */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Geographic <span className="text-rose-500">Reach</span></h2>
            <p className="text-neutral-400 leading-relaxed font-medium">
              Rotaract District 3080 spans across Northern India, creating a bridge between diverse cultures and a singular mission of service.
            </p>
            <div className="flex flex-wrap gap-3">
              {regions.map((r, i) => (
                <span key={i} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-300">
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 aspect-video rounded-[3rem] flex items-center justify-center p-12 relative overflow-hidden group">
             <Globe size={120} className="text-rose-500/20 group-hover:scale-110 group-hover:text-rose-500/40 transition-all duration-1000" />
             <div className="absolute inset-0 bg-gradient-to-t from-rose-500/5 to-transparent"></div>
          </div>
        </section>

        {/* THE JOURNEY TIMELINE */}
        <section className="bg-white/[0.03] border border-white/10 p-12 md:p-20 rounded-[4rem]">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-16 text-center">District <span className="text-rose-500">Journey</span></h2>
          <div className="space-y-12">
            {[
              { year: '1984–85', title: 'Foundation', desc: 'District formation and early identity establishment.' },
              { year: 'Growth', title: 'Network Expansion', desc: 'New clubs joined across Chandigarh, Punjab, and beyond.' },
              { year: 'Leadership', title: 'Legacy Built', desc: 'Home district of PRIP Rajendra K. Saboo, setting global standards.' },
              { year: '2026', title: 'Digital Era', desc: 'Focusing on action, clarity, and district-wide movement through tech.' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-20 border-l border-white/10 pl-8 relative">
                <div className="absolute -left-1.5 top-0 w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
                <div className="md:w-32 shrink-0">
                  <span className="text-rose-500 font-black italic text-xl">{step.year}</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase mb-2 tracking-tight">{step.title}</h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}