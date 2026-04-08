'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Users, MapPin, Building2, 
  ShieldCheck, Star, Zap, Globe, Heart 
} from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Clubs Registered', val: '60+', ic: Building2 },
    { label: 'District Zones', val: '06', ic: MapPin },
    { label: 'Active Members', val: '1200+', ic: Users },
    { label: 'Legacy Years', val: '40+', ic: Star },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <p className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] italic">
              • people of action across 6 zones
            </p>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9]">
              Build leaders.<br />
              <span className="text-rose-500 text-not-italic">Serve</span> communities.<br />
              Create momentum.
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed italic mx-auto lg:mx-0">
              A premium portal for Rotaract District 3080, aligned with the official Rotary International message of fellowship, service, and sustainable impact.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/clubs" className="bg-white text-black font-black px-8 py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-2xl">
                Explore Clubs
              </Link>
              <Link href="/council" className="bg-white/5 border border-white/10 text-white font-black px-8 py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                Meet the Council
              </Link>
            </div>
          </div>

          {/* HERO IMAGE/VISUAL */}
          <div className="flex-1 w-full max-w-xl">
             <div className="bg-white/[0.03] border border-white/10 p-4 rounded-[3.5rem] relative group overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                  alt="District Fellowship" 
                  className="rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-1000 object-cover aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[2.5rem]"></div>
                <div className="absolute bottom-10 left-10 right-10">
                   <p className="text-rose-500 font-black uppercase tracking-widest text-[10px] mb-2">District story, made visible.</p>
                   <p className="text-white font-bold text-sm tracking-tight italic leading-relaxed">Leadership, service, and fellowship across North India—presented with clear hierarchy.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- LIVE STATS GRID --- */}
      <section className="bg-white/[0.02] border-y border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                <s.ic size={24} />
              </div>
              <h3 className="text-4xl font-black italic mb-2 tracking-tighter">{s.val}</h3>
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
            <div key={i} className="bg-white/[0.03] border border-white/10 p-12 rounded-[3.5rem] hover:bg-white/[0.06] transition-all">
              <div className="text-rose-500 mb-8">{item.ic}</div>
              <h3 className="text-xl font-black uppercase mb-4 tracking-tight">{item.t}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed italic">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- QUICK FEATURED CLUBS PREVIEW --- */}
      <section className="py-32 px-6 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
           <div>
              <p className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">• Featured Identity</p>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest tracking-widest tracking-widest tracking-widest leading-none italic">Clubs across <br /> <span className="text-rose-500 text-not-italic">Northern</span> India</h2>
           </div>
           <Link href="/clubs" className="group flex items-center gap-4 text-rose-500 font-black uppercase tracking-widest text-xs">
              Browse Every Club <ArrowRight className="group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Sample Static Preview Cards */}
           {[
             { name: "RAC Chandigarh", zone: "2", pres: "Moin Khan" },
             { name: "RAC Waknaghat", zone: "1", pres: "Alisha Siddiqui" },
             { name: "RAC Shimla Midtown", zone: "1", pres: "Vidushi Gupta" }
           ].map((c, i) => (
             <div key={i} className="bg-black border border-white/10 p-8 rounded-[2.5rem] hover:border-rose-500/50 transition-all">
                <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest block mb-4">Zone {c.zone}</span>
                <h4 className="text-xl font-black uppercase italic mb-4">{c.name}</h4>
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  <span>President: {c.pres}</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest tracking-widest tracking-widest tracking-widest tracking-widest tracking-widest tracking-widest tracking-widest tracking-widest tracking-widest tracking-widest tracking-widest tracking-widest"><ShieldCheck size={14}/></div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-rose-500 p-16 md:p-24 rounded-[4rem] shadow-2xl shadow-rose-500/20">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-8">Ready to serve <br /> with 3080?</h2>
          <Link href="/contact" className="bg-white text-black font-black px-12 py-5 rounded-full text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            Join the Movement
          </Link>
        </div>
      </section>

    </main>
  );
}