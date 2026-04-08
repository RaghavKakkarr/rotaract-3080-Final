"use client";
import React from 'react';
import { Users, Star, ShieldCheck, Award } from 'lucide-react';

const councilMembers = [
  { name: "Rtr. Raghav Kakkar", role: "District Rotaract Representative" },
  { name: "Rtr. Name Surname", role: "District General Secretary" },
  { name: "Rtr. Name Surname", role: "District Treasurer" },
  { name: "Rtr. Name Surname", role: "District Joint Secretary" },
  { name: "Rtr. Name Surname", role: "Zonal Rotaract Representative" },
  { name: "Rtr. Name Surname", role: "District Sergeant-at-Arms" },
];

// 🎯 Fixed: Added TypeScript types for the props
interface MemberProps {
  name: string;
  role: string;
}

function MemberCard({ name, role }: MemberProps) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 group hover:border-rose-500/50 transition-all duration-500">
      <div className="aspect-[4/5] bg-neutral-900 rounded-2xl mb-5 flex items-center justify-center overflow-hidden">
        <div className="text-neutral-800 group-hover:scale-110 transition-transform duration-700">
          <Users size={80} strokeWidth={1} />
        </div>
      </div>
      <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight mb-1">{name}</h3>
      <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">{role}</p>
    </div>
  );
}

export default function CouncilPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <ShieldCheck size={12} />
            <span>District Leadership</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-6">
            District <span className="text-rose-500">Council</span><br />
            2025-26
          </h1>
          <p className="text-neutral-500 max-w-xl mx-auto text-sm uppercase tracking-widest font-medium">
            The visionary leaders driving impact across District 3080.
          </p>
        </div>

        {/* Council Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {councilMembers.map((member, index) => (
            <MemberCard key={index} name={member.name} role={member.role} />
          ))}
        </div>

        {/* DRR Message Section */}
        <div className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-rose-500 to-rose-700 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-white/50"></div>
                <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">DRR's Message</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-none mb-8">
                Leading with <br /> Passion & Purpose
              </h2>
              <p className="text-white/80 text-lg font-medium leading-relaxed mb-8 italic">
                "Our district is not just a collection of clubs, but a powerhouse of young leaders dedicated to Service Above Self. Together, we are creating lasting change."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-white font-black uppercase tracking-tighter italic">Rtr. Raghav Kakkar</div>
                  <div className="text-white/60 text-[10px] uppercase font-bold tracking-widest">District Rotaract Representative</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-sm flex items-center justify-center italic text-white/20 text-4xl font-black">
              DRR 25-26
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}