"use client";
import React from 'react';
import { Users, ShieldCheck, Award } from 'lucide-react';

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
  const councilMembers = [
    { name: "Rtr. Raghav Kakkar", role: "District Rotaract Representative" },
    { name: "Rtr. Name Surname", role: "District General Secretary" },
    { name: "Rtr. Name Surname", role: "District Treasurer" },
    { name: "Rtr. Name Surname", role: "District Joint Secretary" },
    { name: "Rtr. Name Surname", role: "Zonal Rotaract Representative" },
    { name: "Rtr. Name Surname", role: "District Sergeant-at-Arms" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <ShieldCheck size={12} />
            <span>District Leadership</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-6">
            District <span className="text-rose-500">Council</span>
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {councilMembers.map((member, index) => (
            <MemberCard key={index} name={member.name} role={member.role} />
          ))}
        </div>
      </div>
    </div>
  );
}