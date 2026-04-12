"use client";
import React from 'react';
import { Users, Star, ShieldCheck } from 'lucide-react';

interface MemberProps {
  name: string;
  role: string;
  isHead?: boolean;
  imgUrl?: string; 
}

function MemberCard({ name, role, isHead, imgUrl }: MemberProps) {
  return (
    <div className={`bg-white dark:bg-white/5 border ${isHead ? 'border-rose-500/30' : 'border-neutral-200 dark:border-white/10'} rounded-[2.5rem] p-8 group hover:border-rose-400 dark:hover:border-rose-500/50 transition-all duration-500 shadow-sm dark:shadow-none`}>
      <div className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 rounded-[1.5rem] mb-6 flex items-center justify-center overflow-hidden relative">
        {isHead && (
          <div className="absolute top-4 right-4 bg-rose-600 text-white p-2 rounded-xl shadow-xl z-20">
            <Star size={14} fill="currentColor" />
          </div>
        )}
        
        {/* standard img tag use kar rahe hain takki next/image ke domain nakhre na hon */}
        {imgUrl ? (
          <img 
            src={imgUrl} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
            onError={(e) => {
              // Agar photo load na ho toh icon dikhao
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
            }}
          />
        ) : null}

        <div className={`fallback-icon ${imgUrl ? 'hidden' : ''} text-neutral-300 dark:text-neutral-800 group-hover:scale-110 transition-transform duration-700`}>
          <Users size={80} strokeWidth={1} />
        </div>
      </div>
      <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight mb-2 text-neutral-900 dark:text-white">
        {name}
      </h3>
      <p className="text-rose-600 dark:text-rose-500 text-[10px] font-black uppercase tracking-widest italic">
        {role}
      </p>
    </div>
  );
}

export default function CouncilPage() {
  const councilMembers = [
    { 
      name: "Rtn. Dr. Rita Kalra", 
      role: "District Governor", 
      isHead: true,
      // Ye temporary Unsplash links hain jo localhost par chalenge
      imgUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800" 
    },
    { 
      name: "PHF PP Rtr. Dr. Manu Gupta", 
      role: "District Rotaract Representative", 
      isHead: true,
      imgUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800"
    },
    { 
      name: "Rtr. Mohit Singla", 
      role: "District Rotaract Committee Chair",
      imgUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800"
    },
    { 
      name: "Rtr. Yashika Sagar", 
      role: "District Trainer",
      imgUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800"
    },
    { name: "Rtr. Shivansh Sharma", role: "District Youth Chair" },
    { name: "Rtr. Shubham Goyal", role: "DRCC Co-Chair" },
    { name: "Rtr. Sarthak P Perti", role: "District General Secretary" },
    { name: "Rtr. Yashaswi Sharma", role: "District Treasurer" },
    { name: "Rtr. Name Surname", role: "Zonal Rotaract Representative" },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-32 pb-20 px-6 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <section className="mb-24">
          <p className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic">• Leadership Team 2026-27</p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
            District <span className="text-rose-600 dark:text-rose-500 text-not-italic">Council</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed font-medium italic">
            "The strategic backbone of RID 3080, driving action, governance, and fellowship across every zone."
          </p>
        </section>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {councilMembers.map((member, index) => (
            <MemberCard key={index} {...member} />
          ))}
        </div>
      </div>
    </main>
  );
}