'use client';

import { User } from 'lucide-react';

const coreCouncil = [
  { name: "Rajpal Singh", role: "District Governor" },
  { name: "Shashank Kaushik", role: "District Rotaract Representative" },
  { name: "Mohit Singla", role: "District Rotaract Committee Chair" },
  { name: "Shivansh Sharma", role: "District Youth Chair" },
  { name: "Yashika Sagar", role: "District Trainer" },
  { name: "Shubham Goyal", role: "District Rotaract Committee Co-Chair" },
  { name: "Chinmay Abbhi", role: "IPDRR" },
  { name: "Stuti Sharma", role: "Deputy DRR" },
  { name: "Ritik Nagpal", role: "DRS Admin" },
  { name: "Purandhi Gupta", role: "DRS Reporting" },
  { name: "Vasudha Kak", role: "DRS General" },
  { name: "Sarthak Perti", role: "Chief Technology Officer" },
];

const zoneLeadership = [
  { name: "Hema Negi", role: "ADRR Zone 1" },
  { name: "Shivangni Chauhan", role: "ADRS Zone 1" },
  { name: "Prerna Kashyap", role: "ADRR Zone 2" },
  { name: "Raghav Kakkar", role: "ADRS Zone 2" },
  { name: "Riya Wadhwa", role: "ADRR Zone 3" },
  { name: "Anubhav Miglani", role: "ADRR Zone 4" },
  { name: "Shivank Goel", role: "ADRR Zone 5" },
  { name: "Kavy Goyal", role: "ADRR Zone 6" },
];

const serviceTeam = [
  { name: "Aman Garg", role: "Community Services Director" },
  { name: "Nikhil Chanalia", role: "Club Services Director" },
  { name: "Tushar Maheshwari", role: "Vocational Services Director" },
  { name: "Smiksha Hans", role: "Literacy Services Director" },
  { name: "Arpita Malik", role: "International Services Director" },
  { name: "Diya Khurana", role: "Social Media Director" },
  { name: "Vaibhav Sharma", role: "District Photographer" },
];

function MemberCard({ name, role }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 group hover:border-rose-500/50 transition-all duration-500 hover:-translate-y-1 shadow-xl">
      <div className="aspect-[4/5] bg-neutral-900 rounded-2xl mb-5 flex items-center justify-center overflow-hidden border border-white/5 relative">
        <User size={40} className="text-neutral-800 group-hover:text-rose-500/50 transition-colors duration-500" />
        {/* Jab photos aa jayein: <img src={`/council/${name}.jpg`} className="absolute inset-0 object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" /> */}
      </div>
      <h3 className="font-bold text-sm tracking-tight leading-tight mb-1 group-hover:text-rose-500 transition-colors">{name}</h3>
      <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 leading-none">{role}</p>
    </div>
  );
}

export default function CouncilPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-20">
          <p className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic italic tracking-widest">• leadership and operations</p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">Council <span className="text-rose-500 text-not-italic">3080</span></h1>
          <p className="text-neutral-500 max-w-2xl font-medium italic">"Leadership presented as a clear, compact wall. Organizing roles into a visual grid for maximum clarity across the district."</p>
        </header>

        {/* SECTION 1: CORE */}
        <section className="mb-24">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-10 border-b border-white/5 pb-4 tracking-widest">Core Leadership</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {coreCouncil.map((m, i) => <MemberCard key={i} {...m} />)}
          </div>
        </section>

        {/* SECTION 2: ZONES */}
        <section className="mb-24">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-10 border-b border-white/5 pb-4 tracking-widest">Zone Leadership</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {zoneLeadership.map((m, i) => <MemberCard key={i} {...m} />)}
          </div>
        </section>

        {/* SECTION 3: SERVICE TEAM */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 mb-10 border-b border-white/5 pb-4 tracking-widest">Service & Communications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {serviceTeam.map((m, i) => <MemberCard key={i} {...m} />)}
          </div>
        </section>

      </div>
    </main>
  );
}