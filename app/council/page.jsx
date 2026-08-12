"use client";
import React from 'react';
import { Users, Star } from 'lucide-react';

function MemberCard({ name, role, isHead, imgUrl, position = "object-top" }) {
  return (
    <div className={`bg-white dark:bg-white/5 border ${isHead ? 'border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.1)]' : 'border-neutral-200 dark:border-white/10'} rounded-[1.5rem] p-4 md:p-5 group transition-all duration-500 shadow-sm dark:shadow-none flex flex-col`}>
      
      <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative shrink-0">
        {isHead && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-rose-600 text-white p-1.5 rounded-lg shadow-md z-20">
            <Star size={10} className="md:w-3 md:h-3" fill="currentColor" />
          </div>
        )}
        
        {/* 👇 FIX: object-cover ke sath custom alignment (object-top/object-center) apply ki hai */}
        {imgUrl ? (
          <img 
            src={imgUrl} 
            alt={name} 
            className={`w-full h-full object-cover ${position} group-hover:scale-105 transition-transform duration-700`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
            }}
          />
        ) : null}

        <div className={`fallback-icon ${imgUrl ? 'hidden' : ''} text-neutral-300 dark:text-neutral-700 group-hover:scale-110 transition-transform duration-700`}>
          <Users className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1} />
        </div>
      </div>
      
      <div className="mt-auto">
        <h3 className={`text-sm md:text-base font-black uppercase italic tracking-tight leading-tight mb-1 line-clamp-2 ${name === "To Be Announced" ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-900 dark:text-white"}`}>
          {name}
        </h3>
        <p className="text-rose-600 dark:text-rose-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest italic line-clamp-2">
          {role}
        </p>
      </div>
    </div>
  );
}

export default function CouncilPage() {
  const councilMembers = [
    { 
      name: "Rtn. Dr. Rita Kalra", 
      role: "District Governor", 
      isHead: true, 
      imgUrl: "/rita-kalra.jpeg",
      position: "object-top" 
    },
    { 
      name: "Rtr. Purandhi Gupta", 
      role: "District Rotaract Representative (DRR)", 
      isHead: true, 
      imgUrl: "/drr.jpeg",
      // 👇 Purandhi's photo alignment: Top aligned so face stays clear
      position: "object-top" // agar thoda neeche karna ho toh "object-[center_20%]" likh sakte ho
    },
    { 
      name: "Rtn. Atul Tangri", 
      role: "District Rotaract Committee Chair (DRCC)", 
      isHead: true, 
      imgUrl: "/Atul-Sir.jpeg",
      position: "object-top" 
    },
    { name: "To Be Announced", role: "District Trainer" },
    { name: "To Be Announced", role: "District Youth Chair" },
    { name: "To Be Announced", role: "DRCC Co-Chair" },
    { name: "To Be Announced", role: "District General Secretary" },
    { name: "To Be Announced", role: "District Treasurer" },
    { name: "To Be Announced", role: "ZRR Zone 1" },
    { name: "To Be Announced", role: "ZRR Zone 2" },
    { name: "To Be Announced", role: "ZRR Zone 3" },
    { name: "To Be Announced", role: "ZRR Zone 4" },
    { name: "To Be Announced", role: "ZRR Zone 5" },
    { name: "To Be Announced", role: "ZRR Zone 6" },
    { name: "To Be Announced", role: "ZRR Zone 7" },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-28 md:pt-32 pb-20 px-4 md:px-6 font-sans transition-colors duration-300 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        <section className="mb-12 md:mb-16">
          <p className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] mb-3 md:mb-4 italic leading-none">
            • Leadership Team 2026-27
          </p>
          <h1 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 md:mb-6 leading-[1.1] md:leading-none">
            District <span className="text-rose-600 dark:text-rose-500 text-not-italic">Council</span>
          </h1>
          <p className="text-sm md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-4xl leading-relaxed font-medium italic">
            "The strategic backbone of RID 3080, driving action, governance, and fellowship across every zone."
          </p>
        </section>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {councilMembers.map((member, index) => (
            <MemberCard key={index} {...member} />
          ))}
        </div>
        
      </div>
    </main>
  );
}