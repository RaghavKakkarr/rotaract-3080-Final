'use client';

import { 
  Users2, Globe2, Briefcase, Megaphone, 
  CheckCircle2, HeartPulse, ShieldCheck, Globe
} from 'lucide-react';

const servicePillars = [
  { title: "Community Service", desc: "Projects rooted in local needs and visible impact across geography.", icon: <HeartPulse size={28} /> },
  { title: "Club Service", desc: "Focusing on stronger club culture, member participation, and fellowship.", icon: <Users2 size={28} /> },
  { title: "Vocational Service", desc: "Empowering members through skill-building and professional growth.", icon: <Briefcase size={28} /> },
  { title: "International Service", desc: "Cross-border collaboration and global fellowship via Rotary.", icon: <Globe2 size={28} /> },
  { title: "Public Image", desc: "District storytelling, communication, and footprint visibility.", icon: <Megaphone size={28} /> },
  { title: "Youth Leadership", desc: "Mentoring the next generation through the Rotary ecosystem.", icon: <ShieldCheck size={28} /> },
];

const rotaryFocus = ["Promoting Peace", "Fighting Disease", "Water & Sanitation", "Maternal & Child Health", "Supporting Education", "Growing Local Economies", "Protecting the Environment"];

export default function ServicePage() {
  return (
    // 👇 FIX: Mobile pt-24 (navbar clear), Desktop pt-32
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-24 md:pt-32 pb-20 px-4 md:px-6 font-sans transition-colors duration-300 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* HERO SECTION - Spacing Reduced for Mobile */}
        <header className="mb-12 md:mb-24">
          <p className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] mb-3 md:mb-4 italic leading-none">
            • Rotaract and Rotary in action
          </p>
          <h1 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-none">
            Service <span className="text-rose-600 dark:text-rose-500 text-not-italic font-sans">Pillars</span>
          </h1>
          <p className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed font-medium italic">
            "Service areas designed to organize the district’s identity into strong visual blocks."
          </p>
        </header>

        {/* PILLARS GRID - Mobile 1 Column, Desktop 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-20 md:mb-24">
          {servicePillars.map((p, i) => (
            <div key={i} className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] hover:bg-neutral-100 dark:hover:bg-white/[0.05] hover:border-rose-400 transition-all duration-500 group">
              <div className="text-rose-600 dark:text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-3 md:mb-4 text-neutral-900 dark:text-white group-hover:text-rose-600 transition-colors">
                {p.title}
              </h3>
              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-medium italic">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ROTARY AREAS OF FOCUS - Compact padding on mobile */}
        <section className="bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 p-8 md:p-20 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden mb-20 md:mb-24">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-neutral-900 dark:text-white hidden md:block">
            <Globe size={300} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-10 md:mb-12 text-neutral-900 dark:text-white">
              Rotary <span className="text-rose-600 dark:text-rose-500">Areas of Focus</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {rotaryFocus.map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-inner">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm md:text-lg font-bold tracking-tight text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DISTRICT RHYTHM - Spacing Fix */}
        <section className="mt-20 md:mt-32 border-t border-neutral-200 dark:border-white/5 pt-16 md:pt-20">
           <h2 className="text-center text-neutral-400 dark:text-neutral-600 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] mb-12 md:mb-16 italic underline-offset-8">
              • How service becomes district culture
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
              {[
                { title: "Identify a Need", desc: "Starting with a real, measurable community issue." },
                { title: "Mobilize Clubs", desc: "Collaborating across zones and sponsors." },
                { title: "Measure Result", desc: "Tracking impact, participation, and continuity." }
              ].map((step, i) => (
                <div key={i} className="space-y-3 md:space-y-4">
                  <div className="text-3xl md:text-4xl font-black text-neutral-200 dark:text-white/10">0{i+1}</div>
                  <h4 className="text-lg md:text-xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">{step.title}</h4>
                  <p className="text-neutral-500 text-xs md:text-sm italic">{step.desc}</p>
                </div>
              ))}
           </div>
        </section>

      </div>
    </main>
  );
}