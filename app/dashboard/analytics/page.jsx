'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { 
  ArrowLeft, Trophy, AlertTriangle, Zap, 
  Activity, Clock, Users, Calendar, TrendingUp, Target, 
  Droplets, Phone, BarChart3, Fingerprint, Globe, Map, PieChart, Star, FileText, ShieldCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function GodModeAnalytics() {
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState({
    clubs: [],
    members: [],
    events: [],
    stats: { hours: 0, efficiency: 0, activeMemberPercentage: 0, projectDensity: 0, totalImpact: 0 }
  });

  useEffect(() => { fetchComplexAnalytics(); }, []);

  const fetchComplexAnalytics = async () => {
    setLoading(true);
    try {
      const { data: m } = await supabase.from('members').select('*');
      const { data: e } = await supabase.from('events').select('*').eq('is_approved', true);
      const { data: c } = await supabase.from('clubs').select('*');

      if (m && e && c) {
        const totalH = m.reduce((acc, curr) => acc + (Number(curr.volunteer_hours) || 0), 0);
        const totalB = e.reduce((acc, curr) => acc + (Number(curr.beneficiaries_count) || 0), 0);
        const activeMembers = m.filter(mem => mem.volunteer_hours > 0).length;
        
        setDistrictData({
          clubs: c,
          members: m,
          events: e,
          stats: {
            hours: totalH,
            totalImpact: totalB,
            efficiency: m.length > 0 ? (totalH / m.length).toFixed(1) : 0, 
            activeMemberPercentage: m.length > 0 ? ((activeMembers / m.length) * 100).toFixed(0) : 0,
            projectDensity: c.length > 0 ? (e.length / c.length).toFixed(1) : 0
          }
        });
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      const reportID = `RID3080-AUDIT-${Math.floor(1000 + Math.random() * 9000)}`;
      doc.setFillColor(15, 15, 15);
      doc.rect(0, 0, 210, 297, 'F');
      doc.setFillColor(244, 63, 94);
      doc.rect(0, 40, 210, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");
      doc.text("SERVICE AUDIT", 20, 80);
      doc.setFontSize(20);
      doc.text("ROTARACT DISTRICT 3080", 20, 95);
      doc.save(`RID3080_Global_Audit.pdf`);
    } catch (err) { console.error(err); }
  };

  const zoneStats = districtData.clubs.reduce((acc, club) => {
    const clubMembers = districtData.members.filter(mem => mem.club_name === club.name);
    const clubHours = clubMembers.reduce((sum, curr) => sum + (Number(curr.volunteer_hours) || 0), 0);
    if (!acc[club.zone]) acc[club.zone] = { hours: 0, clubs: 0 };
    acc[club.zone].hours += clubHours;
    acc[club.zone].clubs += 1;
    return acc;
  }, {});

  const topClubs = districtData.clubs.map(club => {
    const clubEvents = districtData.events.filter(ev => ev.club_name === club.name).length;
    const impact = districtData.events.filter(ev => ev.club_name === club.name).reduce((sum, curr) => sum + (Number(curr.beneficiaries_count) || 0), 0);
    return { name: club.name, impact, events: clubEvents };
  }).sort((a, b) => b.impact - a.impact).slice(0, 5);

  const riskClubs = districtData.clubs.filter(club => {
    const hasActivity = districtData.events.some(ev => ev.club_name === club.name) || 
                       districtData.members.some(m => m.club_name === club.name && m.volunteer_hours > 0);
    return !hasActivity;
  });

  if (loading) return <div className="min-h-screen bg-neutral-50 dark:bg-black text-rose-600 dark:text-rose-500 flex items-center justify-center font-black animate-pulse uppercase tracking-[0.5em]">Crunching District DNA...</div>;

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-white pt-32 pb-20 px-6 font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* 🌌 Background FX */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rose-600/10 dark:bg-rose-600/5 blur-[180px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 dark:bg-blue-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/dashboard" className="group inline-flex items-center gap-3 text-rose-600 dark:text-rose-500 font-black uppercase text-[10px] tracking-widest hover:text-neutral-900 dark:hover:text-white transition-all mb-4">
              <ArrowLeft size={14} /> Back to hub
            </Link>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none text-neutral-900 dark:text-white">
              District <span className="text-rose-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-rose-500 dark:to-orange-500 text-not-italic">Pulse</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={generatePDFReport}
              className="bg-neutral-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-3xl flex items-center gap-3 hover:bg-rose-600 dark:hover:bg-rose-500 transition-all shadow-xl active:scale-95 group"
            >
              <FileText size={18} className="group-hover:animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest">Download Global Audit</span>
            </button>
            <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-6 rounded-3xl backdrop-blur-md shadow-sm">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1 text-center">District Mobilization</p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black italic text-orange-600 dark:text-orange-500">{districtData.stats.activeMemberPercentage}%</span>
                  <div className="h-10 w-[1px] bg-neutral-200 dark:bg-white/10" />
                  <p className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase leading-tight">Members actively<br/>logging service</p>
                </div>
            </div>
          </div>
        </div>

        {/* 🚀 HIGH-LEVEL STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Lives Impacted', val: districtData.stats.totalImpact, ic: Users, color: 'text-green-600 dark:text-green-500', border: 'hover:border-green-500/30' },
            { label: 'Gross Hours', val: districtData.stats.hours, ic: Clock, color: 'text-rose-600 dark:text-rose-500', border: 'hover:border-rose-500/30' },
            { label: 'Efficiency (H/M)', val: districtData.stats.efficiency, ic: Target, color: 'text-blue-600 dark:text-blue-500', border: 'hover:border-blue-500/30' },
            { label: 'Project Density', val: districtData.stats.projectDensity, ic: PieChart, color: 'text-orange-600 dark:text-orange-500', border: 'hover:border-orange-500/30' },
          ].map((s, i) => (
            <div key={i} className={`bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-8 rounded-[3rem] shadow-sm dark:shadow-xl ${s.border} transition-all group`}>
               <s.ic className={`${s.color} mb-4 group-hover:scale-110 transition-transform`} size={24} />
               <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
               <h3 className="text-5xl font-black tracking-tighter italic text-neutral-900 dark:text-white">{s.val}</h3>
            </div>
          ))}
        </div>

        {/* ZONE & IMPACT TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 p-10 rounded-[3.5rem] shadow-xl relative overflow-hidden">
            <h2 className="text-xl font-black flex items-center gap-3 text-rose-600 dark:text-rose-500 uppercase italic tracking-tighter mb-8"><Map size={24}/> Zone Performance</h2>
            <div className="space-y-6">
               {Object.entries(zoneStats).map(([zone, data]) => (
                 <div key={zone} className="space-y-2">
                    <div className="flex justify-between items-end text-neutral-900 dark:text-white">
                      <p className="font-black uppercase text-sm">Zone {zone}</p>
                      <p className="text-rose-600 dark:text-rose-500 font-black italic">{data.hours} HRS</p>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600 transition-all duration-1000" style={{ width: `${(data.hours / (districtData.stats.hours || 1)) * 100}%` }} />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 p-10 rounded-[3.5rem] shadow-xl">
            <h2 className="text-xl font-black flex items-center gap-3 text-amber-600 dark:text-amber-500 uppercase italic tracking-tighter mb-10"><Trophy size={24}/> Leadership Matrix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {topClubs.map((club, i) => (
                 <div key={i} className="bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 p-6 rounded-[2rem] hover:border-amber-400 dark:hover:border-amber-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-700 uppercase">Rank #0{i+1}</span>
                      <div className="flex gap-1 text-amber-500">{[...Array(5-i)].map((_, s) => <Star key={s} size={10} fill="currentColor" />)}</div>
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-tight mb-4 text-neutral-900 dark:text-white">{club.name}</h4>
                    <div className="flex justify-between border-t border-neutral-200 dark:border-white/5 pt-4">
                       <div><p className="text-xl font-black italic text-green-600 dark:text-green-400">{club.impact}</p><p className="text-[8px] text-neutral-500 font-black uppercase">Lives Impacted</p></div>
                       <div className="text-right"><p className="text-xl font-black italic text-blue-600 dark:text-blue-400">{club.events}</p><p className="text-[8px] text-neutral-500 font-black uppercase">Projects</p></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* DRR RADAR */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 p-10 rounded-[3.5rem] shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><AlertTriangle size={150} className="text-red-500"/></div>
           <h2 className="text-2xl font-black flex items-center gap-3 text-red-600 dark:text-red-500 uppercase italic tracking-tighter mb-10"><Fingerprint size={28}/> DRR Radar</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {riskClubs.map((club, i) => (
                <div key={i} className="bg-white dark:bg-black/60 border border-red-200 dark:border-red-500/10 p-6 rounded-[2.5rem] group hover:border-red-500 transition-all flex flex-col justify-between shadow-sm">
                   <div>
                     <h4 className="text-lg font-black uppercase tracking-tight text-neutral-900 dark:text-white mb-2">{club.name}</h4>
                     <p className="text-[10px] text-red-600 dark:text-red-500 font-bold uppercase tracking-widest">Zone {club.zone} | Dormant Cell</p>
                   </div>
                   <button className="mt-8 py-3 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase hover:bg-red-700 transition-colors">Request Audit</button>
                </div>
              ))}
              {riskClubs.length === 0 && <p className="col-span-full text-center text-neutral-500 uppercase font-black">100% Engagement Efficiency</p>}
           </div>
        </div>

        {/* BLOOD MATRIX */}
        <div className="bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 p-10 rounded-[3.5rem] shadow-xl">
           <h2 className="text-xl font-black flex items-center gap-3 text-rose-600 dark:text-rose-500 uppercase italic tracking-tighter mb-8"><Droplets size={24}/> Blood Support Matrix</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => {
                const count = districtData.members.filter(m => m.blood_group === type).length;
                return (
                  <div key={type} className="bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 p-6 rounded-3xl text-center group hover:border-rose-400 dark:hover:border-rose-500/50 transition-all shadow-sm">
                    <p className="text-2xl font-black text-rose-600 dark:text-rose-500 group-hover:scale-110 transition-transform">{type}</p>
                    <p className="text-[10px] text-neutral-500 font-black uppercase tracking-tighter mt-1">{count} Units</p>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </main>
  );
}