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

  // 🎯 GLOBAL LEVEL MONSTER PDF ENGINE (4-5 PAGES)
  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();
      const reportID = `RID3080-AUDIT-${Math.floor(1000 + Math.random() * 9000)}`;

      // --- PAGE 1: COVER PAGE ---
      doc.setFillColor(15, 15, 15); // Dark Background
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setFillColor(244, 63, 94); // Rose Accent
      doc.rect(0, 40, 210, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");
      doc.text("SERVICE AUDIT", 20, 80);
      doc.setFontSize(20);
      doc.text("ROTARACT DISTRICT 3080", 20, 95);
      
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text(`Official Humanitarian Impact Document | Term 2025-26`, 20, 110);
      doc.text(`Report ID: ${reportID}`, 20, 118);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 126);

      doc.setFillColor(244, 63, 94);
      doc.rect(20, 140, 50, 1, 'F');

      doc.setFontSize(10);
      doc.text("Verified by District Intelligence Unit (DIU)", 20, 270);

      // --- PAGE 2: EXECUTIVE HUMANITARIAN SUMMARY ---
      doc.addPage();
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(22);
      doc.text("1. Executive Summary", 15, 25);
      
      autoTable(doc, {
        startY: 35,
        head: [['Strategic Metric', 'Audited Figure', 'Rating']],
        body: [
          ['Lives Impacted (Direct Beneficiaries)', `${districtData.stats.totalImpact}`, 'ELITE IMPACT'],
          ['Gross Volunteer Service Hours', `${districtData.stats.hours} HRS`, 'HIGH MOBILIZATION'],
          ['District Project Count', `${districtData.events.length} Approved`, 'ACTIVE'],
          ['Active Member Ratio', `${districtData.stats.activeMemberPercentage}%`, districtData.stats.activeMemberPercentage > 50 ? 'OPTIMAL' : 'DEVELOPING'],
          ['Average Efficiency (Hours/Member)', `${districtData.stats.efficiency} H/M`, 'CONSISTENT']
        ],
        theme: 'grid',
        headStyles: { fillColor: [244, 63, 94] },
        styles: { fontSize: 10, cellPadding: 5 }
      });

      doc.setFontSize(14);
      doc.text("Avenue-Wise Mission Distribution", 15, doc.lastAutoTable.finalY + 20);
      
      const avenueStats = districtData.events.reduce((acc, ev) => {
        const ave = ev.service_avenue || 'General';
        acc[ave] = (acc[ave] || 0) + 1; return acc;
      }, {});
      const avenueBody = Object.entries(avenueStats).map(([name, count]) => [name, count, `${((count/districtData.events.length)*100).toFixed(1)}%`]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [['Service Avenue', 'Total Projects', 'District Share %']],
        body: avenueBody,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] }
      });

      // --- PAGE 3: CLUB PERFORMANCE DIRECTORY ---
      doc.addPage();
      doc.setFontSize(20);
      doc.text("2. Club Contribution Index", 15, 25);
      
      const clubData = districtData.clubs.map(club => {
        const cEvents = districtData.events.filter(ev => ev.club_name === club.name);
        const cImpact = cEvents.reduce((acc, curr) => acc + (Number(curr.beneficiaries_count) || 0), 0);
        const cHours = districtData.members.filter(m => m.club_name === club.name).reduce((acc, curr) => acc + (Number(curr.volunteer_hours) || 0), 0);
        return [club.name, club.zone, cEvents.length, cImpact, cHours];
      }).sort((a, b) => b[3] - a[3]);

      autoTable(doc, {
        startY: 35,
        head: [['Club Name', 'Zone', 'Projects', 'Lives Impacted', 'Total Hours']],
        body: clubData,
        theme: 'grid',
        headStyles: { fillColor: [31, 41, 55] },
        styles: { fontSize: 8 }
      });

      // --- PAGE 4: EMERGENCY PREPAREDNESS & GOVERNANCE ---
      doc.addPage();
      doc.setFontSize(20);
      doc.text("3. District Readiness & Compliance", 15, 25);
      
      doc.setFontSize(12);
      doc.text("Medical Resource Inventory (Blood Grouping Stats)", 15, 35);
      const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
      const bloodBody = bloodTypes.map(t => [t, districtData.members.filter(m => m.blood_group === t).length]);

      autoTable(doc, {
        startY: 40,
        head: [['Blood Group', 'Ready Donors']],
        body: bloodBody,
        theme: 'plain',
        headStyles: { fillColor: [220, 38, 38] }
      });

      doc.setFontSize(16);
      doc.text("Administrative Declaration", 15, doc.lastAutoTable.finalY + 30);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const governanceText = "This report serves as an official audit of Rotaract District 3080. All data points including service hours, lives impacted, and project counts are verified via decentralized presidential logs and validated through photo evidence submitted to the District Admin portal. Any discrepancies should be reported to the DRR's office within 7 days of this generation.";
      doc.text(doc.splitTextToSize(governanceText, 180), 15, doc.lastAutoTable.finalY + 40);

      // --- FINAL: SAVE ---
      doc.save(`RID3080_Global_Audit_v1.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF Engine Error. Check Console.");
    }
  };

  // Logic for UI Blocks
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

  if (loading) return <div className="min-h-screen bg-black text-rose-500 flex items-center justify-center font-black animate-pulse uppercase tracking-[0.5em]">Crunching District DNA...</div>;

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rose-600/5 blur-[180px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/dashboard" className="group inline-flex items-center gap-3 text-rose-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all mb-4">
              <ArrowLeft size={14} /> Back to hub
            </Link>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              District <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 text-not-italic">Pulse</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={generatePDFReport}
              className="bg-white text-black px-8 py-4 rounded-3xl flex items-center gap-3 hover:bg-rose-500 hover:text-white transition-all shadow-2xl active:scale-95 group"
            >
              <FileText size={18} className="group-hover:animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest">Download Global Audit</span>
            </button>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1 text-center">District Mobilization</p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black italic text-orange-500">{districtData.stats.activeMemberPercentage}%</span>
                  <div className="h-10 w-[1px] bg-white/10" />
                  <p className="text-[9px] font-bold text-neutral-400 uppercase leading-tight">Members actively<br/>logging service</p>
                </div>
            </div>
          </div>
        </div>

        {/* 🚀 HIGH-LEVEL STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-xl hover:border-green-500/30 transition-all group">
             <Users className="text-green-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
             <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Lives Impacted</p>
             <h3 className="text-5xl font-black tracking-tighter italic">{districtData.stats.totalImpact}</h3>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-xl hover:border-rose-500/30 transition-all group">
             <Clock className="text-rose-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
             <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Gross Hours</p>
             <h3 className="text-5xl font-black tracking-tighter italic">{districtData.stats.hours}</h3>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-xl hover:border-blue-500/30 transition-all group">
             <Target className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
             <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Efficiency (H/M)</p>
             <h3 className="text-5xl font-black tracking-tighter italic">{districtData.stats.efficiency}</h3>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-xl hover:border-orange-500/30 transition-all group">
             <PieChart className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
             <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Project Density</p>
             <h3 className="text-5xl font-black tracking-tighter italic">{districtData.stats.projectDensity}</h3>
          </div>
        </div>

        {/* ZONE & IMPACT TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <h2 className="text-xl font-black flex items-center gap-3 text-rose-500 uppercase italic tracking-tighter mb-8"><Map size={24}/> Zone Performance</h2>
            <div className="space-y-6">
               {Object.entries(zoneStats).map(([zone, data]) => (
                 <div key={zone} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <p className="font-black uppercase text-sm">Zone {zone}</p>
                      <p className="text-rose-500 font-black italic">{data.hours} HRS</p>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600 transition-all duration-1000" style={{ width: `${(data.hours / (districtData.stats.hours || 1)) * 100}%` }} />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 p-10 rounded-[3.5rem] shadow-2xl">
            <h2 className="text-xl font-black flex items-center gap-3 text-amber-500 uppercase italic tracking-tighter mb-10"><Trophy size={24}/> Leadership Matrix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {topClubs.map((club, i) => (
                 <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] hover:border-amber-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-neutral-700 uppercase">Rank #0{i+1}</span>
                      <div className="flex gap-1 text-amber-500">{[...Array(5-i)].map((_, s) => <Star key={s} size={10} fill="currentColor" />)}</div>
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-tight mb-4">{club.name}</h4>
                    <div className="flex justify-between border-t border-white/5 pt-4">
                       <div><p className="text-xl font-black italic text-green-400">{club.impact}</p><p className="text-[8px] text-neutral-500 font-black uppercase">Lives Impacted</p></div>
                       <div className="text-right"><p className="text-xl font-black italic text-blue-400">{club.events}</p><p className="text-[8px] text-neutral-500 font-black uppercase">Projects</p></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* DRR RADAR */}
        <div className="bg-red-950/20 border border-red-500/20 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><AlertTriangle size={150} className="text-red-500"/></div>
           <h2 className="text-2xl font-black flex items-center gap-3 text-red-500 uppercase italic tracking-tighter mb-10"><Fingerprint size={28}/> DRR Radar</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {riskClubs.map((club, i) => (
                <div key={i} className="bg-black/60 border border-red-500/10 p-6 rounded-[2.5rem] group hover:border-red-500 transition-all flex flex-col justify-between">
                   <div>
                     <h4 className="text-lg font-black uppercase tracking-tight text-white mb-2">{club.name}</h4>
                     <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Zone {club.zone} | Dormant Cell</p>
                   </div>
                   <button className="mt-8 py-3 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase">Request Audit</button>
                </div>
              ))}
              {riskClubs.length === 0 && <p className="col-span-full text-center text-neutral-500 uppercase font-black">100% Engagement Efficiency</p>}
           </div>
        </div>

        {/* BLOOD MATRIX */}
        <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[3.5rem] shadow-xl">
           <h2 className="text-xl font-black flex items-center gap-3 text-rose-500 uppercase italic tracking-tighter mb-8"><Droplets size={24}/> Blood Support Matrix</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => {
                const count = districtData.members.filter(m => m.blood_group === type).length;
                return (
                  <div key={type} className="bg-black/40 border border-white/5 p-6 rounded-3xl text-center group hover:border-rose-500/50 transition-all">
                    <p className="text-2xl font-black text-rose-500 group-hover:scale-110 transition-transform">{type}</p>
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