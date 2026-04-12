'use client';

import { 
  Users2, Globe2, Briefcase, Megaphone, 
  CheckCircle2, HeartPulse, ShieldCheck, Globe
} from 'lucide-react';

const servicePillars = [
  { title: "Community Service", desc: "Projects rooted in local needs and visible impact across geography.", icon: <HeartPulse size={32} /> },
  { title: "Club Service", desc: "Focusing on stronger club culture, member participation, and fellowship.", icon: <Users2 size={32} /> },
  { title: "Vocational Service", desc: "Empowering members through skill-building and professional growth.", icon: <Briefcase size={32} /> },
  { title: "International Service", desc: "Cross-border collaboration and global fellowship via Rotary.", icon: <Globe2 size={32} /> },
  { title: "Public Image", desc: "District storytelling, communication, and footprint visibility.", icon: <Megaphone size={32} /> },
  { title: "Youth Leadership", desc: "Mentoring the next generation through the Rotary ecosystem.", icon: <ShieldCheck size={32} /> },
];

const rotaryFocus = ["Promoting Peace", "Fighting Disease", "Water & Sanitation", "Maternal & Child Health", "Supporting Education", "Growing Local Economies", "Protecting the Environment"];

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-32 pb-20 px-6 font-sans transition-colors duration-300">
      {/* 🎯 Container matched to max-w-6xl */}
      <div className="max-w-6xl mx-auto">
        
        {/* HERO SECTION */}
        <header className="mb-24">
          <p className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic tracking-widest">• Rotaract and Rotary in action</p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
            Service <span className="text-rose-600 dark:text-rose-500 text-not-italic font-sans">Pillars</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed font-medium italic">
            "Service areas designed to feel active, visual, and easy to scan. Organizing the district’s identity into strong visual blocks."
          </p>
        </header>

        {/* PILLARS GRID (About Page Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {servicePillars.map((p, i) => (
            <div key={i} className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-10 rounded-[3rem] hover:bg-neutral-100 dark:hover:bg-white/[0.05] hover:border-rose-400 dark:hover:border-rose-500/30 transition-all duration-500 group shadow-sm dark:shadow-none">
              <div className="text-rose-600 dark:text-rose-500 mb-8 group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-rose-600 dark:group-hover:text-rose-500 transition-colors text-neutral-900 dark:text-white">
                {p.title}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-500 text-sm leading-relaxed font-medium italic">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ROTARY AREAS OF FOCUS (Reach Style Card) */}
        <section className="bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 p-12 md:p-20 rounded-[4rem] relative overflow-hidden shadow-md dark:shadow-none mb-24">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05] dark:opacity-[0.03] text-neutral-900 dark:text-white">
            <Globe size={300} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-12 text-neutral-900 dark:text-white">
              Rotary <span className="text-rose-600 dark:text-rose-500">Areas of Focus</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rotaryFocus.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-inner">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DISTRICT RHYTHM (Journey Style) */}
        <section className="mt-32 border-t border-neutral-200 dark:border-white/5 pt-20">
           <h2 className="text-center text-neutral-400 dark:text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em] mb-16 italic tracking-widest">• How service becomes district culture</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { title: "Identify a Need", desc: "Starting with a real, measurable community issue." },
                { title: "Mobilize Clubs", desc: "Collaborating across zones and sponsors." },
                { title: "Measure Result", desc: "Tracking impact, participation, and continuity." }
              ].map((step, i) => (
                <div key={i} className="space-y-4">
                  <div className="text-4xl font-black text-neutral-200 dark:text-white/10">0{i+1}</div>
                  <h4 className="text-xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">{step.title}</h4>
                  <p className="text-neutral-500 text-sm italic">{step.desc}</p>
                </div>
              ))}
           </div>
        </section>

      </div>
    </main>
  );
}