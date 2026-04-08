'use client';

import { 
  Users2, Building, Briefcase, Globe2, 
  Lightbulb, Megaphone, CheckCircle2, HeartPulse, 
  BookOpen, Sprout, ShieldCheck 
} from 'lucide-react';

const servicePillars = [
  { 
    title: "Community Service", 
    desc: "Projects rooted in local needs and visible impact across the district's geography.", 
    icon: <HeartPulse size={32} /> 
  },
  { 
    title: "Club Service", 
    desc: "Focusing on stronger club culture, member participation, and fellowship experience.", 
    icon: <Users2 size={32} /> 
  },
  { 
    title: "Vocational Service", 
    desc: "Empowering members through skill-building, professional growth, and mentorship.", 
    icon: <Briefcase size={32} /> 
  },
  { 
    title: "International Service", 
    desc: "Cross-border collaboration and global fellowship through the Rotary network.", 
    icon: <Globe2 size={32} /> 
  },
  { 
    title: "Public Image", 
    desc: "District storytelling, communication, and visibility of our service footprint.", 
    icon: <Megaphone size={32} /> 
  },
  { 
    title: "Youth Leadership", 
    desc: "Mentoring the next generation of leaders through the Rotary ecosystem.", 
    icon: <ShieldCheck size={32} /> 
  },
];

const rotaryFocus = [
  "Promoting Peace", "Fighting Disease", "Water & Sanitation", 
  "Maternal & Child Health", "Supporting Education", 
  "Growing Local Economies", "Protecting the Environment"
];

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO */}
        <header className="mb-24">
          <p className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic tracking-widest">• Rotaract and Rotary in action</p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">Service <span className="text-rose-500 text-not-italic font-sans">Pillars</span></h1>
          <p className="text-neutral-500 max-w-2xl font-medium italic italic">"Service areas designed to feel active, visual, and easy to scan. Organizing the district’s identity into strong visual blocks."</p>
        </header>

        {/* PILLARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {servicePillars.map((p, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 p-12 rounded-[3.5rem] hover:bg-white/[0.05] hover:border-rose-500/30 transition-all duration-500 group">
              <div className="text-rose-500 mb-8 group-hover:scale-110 transition-transform duration-500">
                {p.icon}
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-rose-500 transition-colors">{p.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* ROTARY AREAS OF FOCUS SECTION */}
        <section className="bg-white/[0.02] border border-white/10 p-12 md:p-24 rounded-[4rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Globe2 size={300} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-12">Rotary <span className="text-rose-500">Areas of Focus</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rotaryFocus.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-neutral-300 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DISTRICT RHYTHM */}
        <section className="mt-32">
           <h2 className="text-center text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em] mb-16 italic tracking-widest italic tracking-widest italic tracking-widest">• How service becomes district culture</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center italic tracking-widest">
              {[
                { title: "Identify a Need", desc: "Starting with a real, measurable community issue." },
                { title: "Mobilize Clubs", desc: "Collaborating across zones and sponsors." },
                { title: "Measure Result", desc: "Tracking impact, participation, and continuity." }
              ].map((step, i) => (
                <div key={i} className="space-y-4 font-sans">
                  <div className="text-4xl font-black text-white/10">0{i+1}</div>
                  <h4 className="text-xl font-bold uppercase tracking-tight">{step.title}</h4>
                  <p className="text-neutral-500 text-sm italic">{step.desc}</p>
                </div>
              ))}
           </div>
        </section>

      </div>
    </main>
  );
}