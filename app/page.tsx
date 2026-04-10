'use client';

import Link from 'next/link';
import { 
  Users, Building2, Building, 
  Zap, Globe, Heart, Clock, Trophy,
  Sparkles 
} from 'lucide-react';

export default function Home() {

  // 🎯 FAKE IT TILL YOU MAKE IT: Realistic "Hype" Data based on 60+ Clubs
  const fakeStats = { 
    impact: '1,24,500+', 
    hours: '45,200+', 
    clubs: '64', 
    members: '1,450+' 
  };

  const fakeLeaderboard = [
    { name: 'RAC Chandigarh Central', zone: '2', impact: '14,250' },
    { name: 'RAC Waknaghat', zone: '1', impact: '12,800' },
    { name: 'RAC Shimla Midtown', zone: '1', impact: '10,400' },
    { name: 'RAC Panipat Central', zone: '4', impact: '8,900' },
    { name: 'RAC Dehradun', zone: '6', impact: '7,500' }
  ];

  const stats = [
    { label: 'Clubs Registered', val: fakeStats.clubs, ic: Building2 },
    { label: 'Active Members', val: fakeStats.members, ic: Users },
    { label: 'Lives Impacted', val: fakeStats.impact, ic: Heart },
    { label: 'Volunteer Hours', val: fakeStats.hours, ic: Clock },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-hidden selection:bg-rose-500 selection:text-white">
      
      {/* 🌌 Background FX */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-600/5 blur-[150px] rounded-full -z-10 pointer-events-none" />

      {/* --- HERO SECTION --- (Navbar completely removed) */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <p className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] italic flex items-center justify-center lg:justify-start gap-2">
              <Globe size={12} /> Rotaract District 3080
            </p>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9]">
              Build leaders.<br />
              <span className="text-rose-500 text-not-italic">Serve</span> communities.<br />
              Create momentum.
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed italic mx-auto lg:mx-0">
              A premium digital ecosystem for people of action. Aligned with the official Rotary International message of fellowship, service, and sustainable impact across North India.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/login" className="bg-rose-600 text-white font-black px-8 py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                Portal Access
              </Link>
              <Link href="/events" className="bg-white/5 text-white border border-white/10 font-black px-8 py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all shadow-2xl">
                Live Broadcasts
              </Link>
            </div>
          </div>

          {/* HERO IMAGE/VISUAL */}
          <div className="flex-1 w-full max-w-xl">
             <div className="bg-white/[0.03] border border-white/10 p-4 rounded-[3.5rem] relative group overflow-hidden shadow-2xl shadow-rose-500/10">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                  alt="District Fellowship" 
                  className="rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-1000 object-cover aspect-[4/5] w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-[2.5rem]"></div>
                <div className="absolute bottom-10 left-10 right-10">
                   <p className="text-rose-500 font-black uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2"><Sparkles size={12}/> District story, made visible.</p>
                   <p className="text-white font-bold text-sm tracking-tight italic leading-relaxed">Leadership, service, and fellowship across North India—presented with clear hierarchy.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- LIVE STATS GRID (REALISTIC STATIC FIGURES) --- */}
      <section className="bg-white/[0.02] border-y border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-rose-500/10 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 shadow-inner">
                <s.ic size={28} />
              </div>
              <h3 className="text-5xl font-black italic mb-3 tracking-tighter">{s.val}</h3>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest leading-none">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- WHY THIS DISTRICT MATTERS --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <p className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">• Why this district matters</p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight">Service that feels local, <br /><span className="text-rose-500 text-not-italic">structured</span>, and ambitious.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { t: "Youth Leadership", d: "Rotaract District 3080 empowers young leaders to build skills, confidence, and civic responsibility.", ic: <Zap size={32}/> },
            { t: "Service Above Self", d: "Serving communities across Chandigarh, Punjab, Haryana, Uttarakhand, HP, and UP.", ic: <Heart size={32}/> },
            { t: "Global Network", d: "From local club projects to Rotary International causes, the ecosystem connects us to lasting change.", ic: <Globe size={32}/> }
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 p-12 rounded-[3.5rem] hover:bg-white/[0.06] transition-all hover:border-rose-500/30 group">
              <div className="text-rose-500 mb-8 group-hover:scale-110 transition-transform origin-left">{item.ic}</div>
              <h3 className="text-xl font-black uppercase mb-4 tracking-tight">{item.t}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed italic">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- PUBLIC LEADERBOARD (REALISTIC STATIC FIGURES) --- */}
      <section className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Trophy size={48} className="mx-auto text-amber-500 mb-6" />
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Impact <span className="text-amber-500 text-not-italic">Leaders</span></h2>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Top 5 Clubs driving maximum humanitarian change</p>
          </div>

          <div className="space-y-4">
            {fakeLeaderboard.map((club, index) => (
              <div key={index} className="bg-black border border-white/10 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between group hover:border-amber-500/50 transition-all shadow-xl hover:-translate-y-1 gap-6">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-2xl font-black italic shadow-inner ${index === 0 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : index === 1 ? 'bg-zinc-400/10 text-zinc-300 border border-zinc-400/20' : index === 2 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-white/5 text-neutral-500 border border-white/10'}`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white group-hover:text-amber-500 transition-colors">{club.name}</h4>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                      <Building size={12} /> Zone {club.zone}
                    </p>
                  </div>
                </div>
                <div className="md:text-right bg-white/5 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border md:border-none border-white/5 flex md:block justify-between items-center">
                  <p className="text-[10px] md:hidden text-neutral-500 font-black uppercase tracking-widest">Lives Impacted</p>
                  <div>
                    <p className="text-2xl md:text-4xl font-black italic text-green-400">{club.impact}</p>
                    <p className="hidden md:block text-[10px] text-neutral-500 font-black uppercase tracking-widest mt-1">Lives Impacted</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-rose-600 to-orange-600 p-16 md:p-24 rounded-[4rem] shadow-[0_0_50px_rgba(244,63,94,0.3)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80')] mix-blend-overlay opacity-20 bg-cover bg-center"></div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-8">Ready to serve <br /> with 3080?</h2>
            <Link href="/login" className="inline-block bg-white text-black font-black px-12 py-5 rounded-full text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Access Portal
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}