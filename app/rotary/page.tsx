'use client';

// 🎯 IMPORT LINK ADDED HERE (This was the missing piece)
import Link from 'next/link';
import { 
  Globe, Heart, Layers, ShieldCheck, 
  Target, Zap, Flame, Award 
} from 'lucide-react';

const rotaryStats = [
  { label: 'Global Members', val: '1.4M+', ic: Globe },
  { label: 'Active Clubs', val: '45,000+', ic: Layers },
  { label: 'Foundation Impact', val: '$5.5B+', ic: Heart },
];

const missionBlocks = [
  {
    title: "Mission",
    desc: "We provide service to others, promote integrity, and advance world understanding, goodwill, and peace through our fellowship of business, professional, and community leaders.",
    ic: <Target className="text-rose-500" size={40} />
  },
  {
    title: "Ethos",
    desc: "Service Above Self and the search for lasting change define the whole system of action. Projects are designed to be sustainable, measurable, and visible.",
    ic: <Zap className="text-rose-500" size={40} />
  }
];

export default function RotaryPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <header className="mb-24">
          <p className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic tracking-widest">• the wider movement</p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
            Rotary <span className="text-rose-500 text-not-italic font-sans">International</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl text-xl leading-relaxed italic">
            Rotary is a worldwide network of members united by service, fellowship, and the desire to create lasting change across borders.
          </p>
        </header>

        {/* GLOBAL STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {rotaryStats.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] flex flex-col items-center text-center group hover:bg-white/[0.08] transition-all">
              <s.ic className="text-rose-500 mb-6 group-hover:scale-110 transition-transform duration-500" size={40} />
              <h3 className="text-5xl font-black tracking-tighter mb-2 italic">{s.val}</h3>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* MISSION & ETHOS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
          {missionBlocks.map((block, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/10 p-12 md:p-16 rounded-[4rem] group hover:border-rose-500/30 transition-all duration-700">
              <div className="mb-8">{block.ic}</div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6 group-hover:text-rose-500 transition-colors">{block.title}</h2>
              <p className="text-neutral-400 text-lg leading-relaxed font-medium italic">"{block.desc}"</p>
            </div>
          ))}
        </section>

        {/* THE PILLARS OF ACTION */}
        <section className="bg-white/[0.03] border border-white/10 p-12 md:p-20 rounded-[4rem] relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 opacity-[0.03] rotate-12">
            <Flame size={400} />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-16">Pillars of <span className="text-rose-500">Action</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { t: "Network", d: "Clubs and districts work together across borders." },
                { t: "Fellowship", d: "Members build durable relationships while serving." },
                { t: "Action", d: "Projects are designed to be sustainable and visible." }
              ].map((p, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="text-xl font-bold uppercase tracking-tight">{p.t}</h4>
                  <p className="text-neutral-500 text-sm italic">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA TO CONTACT */}
        <section className="mt-32 text-center">
            <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em] mb-8">• Join the movement</p>
            <Link href="/contact" className="inline-block bg-white text-black font-black px-12 py-6 rounded-full text-xs uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all shadow-2xl shadow-rose-500/10">
              Connect with us
            </Link>
        </section>

      </div>
    </main>
  );
}