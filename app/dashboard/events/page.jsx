'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Calendar, ArrowLeft, Loader2, Sparkles, 
  Zap, Building, Layers, Users, Link as LinkIcon, ShieldCheck, FileCheck 
} from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EventUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clubName, setClubName] = useState(""); 
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    service_avenue: '',
    beneficiaries_count: '',
    proof_link: '' 
  });

  const avenues = [
    "Club Service",
    "Community Service",
    "International Service",
    "Professional Development",
    "Vocational Service",
    "Public Image"
  ];

  useEffect(() => {
    const getClubInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('clubs')
          .select('name')
          .eq('president_email', session.user.email)
          .single();
        
        if (data) setClubName(data.name);
      }
    };
    getClubInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.proof_link) return alert("Bhai, Proof Link (Drive/Insta) daalna zaroori hai!");
    if (!formData.service_avenue) return alert("Avenue select karna zaroori hai!");
    if (!clubName) return alert("Club sync nahi hua, thoda ruko...");
    
    setLoading(true);

    try {
      const { error } = await supabase.from('events').insert([
        {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          service_avenue: formData.service_avenue,
          beneficiaries_count: parseInt(formData.beneficiaries_count) || 0, 
          club_name: clubName,
          image_url: formData.proof_link, 
          is_approved: false, 
          created_at: new Date(),
        },
      ]);

      if (error) throw error;
      alert("Event sent to District Admin for approval! 🚀");
      router.push('/dashboard');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-32 pb-20 px-6 font-sans transition-colors duration-300">
      
      {/* 🌌 Background Decoration */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/5 via-transparent to-transparent -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* BACK ACTION */}
        <div className="mb-12"> 
          <Link href="/dashboard" className="group text-rose-600 dark:text-rose-500 font-black flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-all uppercase tracking-[0.2em] text-[10px] italic">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
        </div>

        {/* HEADER SECTION (Consistent with About Page Header) */}
        <header className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-500 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles size={12} /> Live Pulse Reporting
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-6">
            Capture <span className="text-rose-600 dark:text-rose-500 text-not-italic">Impact</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed font-medium italic">
            "Report your club projects with clarity. Every submission is a step towards the District 3080 Citation."
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* EVIDENCE SIDEBAR (Consistent with About/Stats style) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-10 rounded-[3rem] text-left shadow-sm dark:shadow-none relative overflow-hidden group">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                <FileCheck size={28} className="text-rose-600 dark:text-rose-500" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-neutral-900 dark:text-white">Audit Trail</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
                Projects are subject to verification by the District Intelligence Unit. Provide <span className="text-rose-600">Google Drive</span> or <span className="text-rose-600">Instagram</span> links.
              </p>
              <div className="flex items-center gap-3 text-[9px] font-black uppercase text-neutral-400 tracking-widest border-t border-neutral-100 dark:border-white/5 pt-6">
                <ShieldCheck size={14} className="text-rose-600" /> DRR Verification Required
              </div>
            </div>

            <div className="p-8 border border-dashed border-neutral-300 dark:border-white/10 rounded-[3rem] text-center">
              <p className="text-neutral-400 dark:text-neutral-500 text-[9px] font-black uppercase tracking-[0.4em] italic leading-relaxed">
                "Transparency leads to fellowship."
              </p>
            </div>
          </div>

          {/* FORM AREA (Consistent with About Journey Style) */}
          <div className="lg:col-span-8 space-y-8 bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-10 md:p-14 rounded-[4rem] shadow-sm dark:shadow-none">
            
            <div className="space-y-10">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-neutral-500 ml-4 tracking-widest italic">Project Headline</label>
                <input 
                  required type="text" 
                  className="w-full bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-[2rem] px-8 py-6 outline-none focus:border-rose-500 transition-all text-2xl font-black italic uppercase tracking-tighter text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-800"
                  placeholder="WHAT HAPPENED?"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Evidence Link */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-rose-500 ml-4 tracking-widest italic">Proof of Action (Link)</label>
                <div className="relative group">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500">
                     <LinkIcon size={18} />
                   </div>
                   <input 
                     required type="url" 
                     placeholder="Drive or Instagram URL..." 
                     className="w-full bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-full py-5 pl-14 pr-8 outline-none focus:border-rose-500 transition-all text-xs font-bold text-neutral-800 dark:text-white placeholder:text-neutral-400 italic" 
                     value={formData.proof_link}
                     onChange={(e) => setFormData({...formData, proof_link: e.target.value})} 
                   />
                </div>
              </div>

              {/* Multi-input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-neutral-500 ml-4 tracking-widest italic">Event Date</label>
                    <div className="flex items-center gap-3 bg-neutral-100 dark:bg-white/5 rounded-2xl p-5 border border-neutral-200 dark:border-white/5">
                        <Calendar size={16} className="text-rose-600" />
                        <input required type="date" value={formData.date} className="bg-transparent w-full outline-none text-[11px] font-black uppercase text-neutral-800 dark:text-white cursor-pointer" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-neutral-500 ml-4 tracking-widest italic">Venue/City</label>
                    <div className="flex items-center gap-3 bg-neutral-100 dark:bg-white/5 rounded-2xl p-5 border border-neutral-200 dark:border-white/5">
                        <MapPin size={16} className="text-rose-600" />
                        <input required type="text" placeholder="CHANDIGARH / SHIMLA" value={formData.location} className="bg-transparent w-full outline-none text-[11px] font-black uppercase text-neutral-800 dark:text-white placeholder:text-neutral-300" onChange={(e) => setFormData({...formData, location: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-neutral-500 ml-4 tracking-widest italic">Avenue</label>
                    <div className="flex items-center gap-3 bg-neutral-100 dark:bg-white/5 rounded-2xl p-5 border border-neutral-200 dark:border-white/5">
                        <Layers size={16} className="text-rose-600" />
                        <select 
                        required 
                        value={formData.service_avenue} 
                        className="bg-transparent outline-none text-[11px] font-black uppercase text-neutral-800 dark:text-white w-full cursor-pointer"
                        onChange={(e) => setFormData({...formData, service_avenue: e.target.value})}
                        >
                        <option value="" className="bg-white dark:bg-black">SELECT AVENUE</option>
                        {avenues.map(a => <option key={a} value={a} className="bg-white dark:bg-black">{a.toUpperCase()}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-neutral-500 ml-4 tracking-widest italic">Beneficiaries</label>
                    <div className="flex items-center gap-3 bg-neutral-100 dark:bg-white/5 rounded-2xl p-5 border border-neutral-200 dark:border-white/5">
                        <Users size={16} className="text-rose-600" />
                        <input 
                        required type="number" placeholder="TOTAL PEOPLE" 
                        className="bg-transparent w-full outline-none text-[11px] font-black uppercase text-neutral-800 dark:text-white placeholder:text-neutral-300"
                        onChange={(e) => setFormData({...formData, beneficiaries_count: e.target.value})} 
                        />
                    </div>
                </div>
              </div>

              {/* Reporting Club Info */}
              <div className="flex items-center gap-4 bg-neutral-50 dark:bg-white/5 rounded-3xl p-6 border border-neutral-200 dark:border-white/5">
                <Building size={20} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
                <div>
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Reporting Club (Verified)</span>
                    <p className="text-xs font-black uppercase text-neutral-900 dark:text-white">{clubName || "SYNCING..."}</p>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-neutral-500 ml-4 tracking-widest italic">Impact Summary</label>
                <textarea 
                  required rows={4}
                  placeholder="DESCRIBE THE OUTCOME..."
                  value={formData.description}
                  className="w-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-[3rem] px-8 py-8 focus:border-rose-500 outline-none transition-all text-sm font-medium italic resize-none text-neutral-800 dark:text-white placeholder:text-neutral-300 shadow-inner"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button 
                disabled={loading} type="submit" 
                className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-black py-6 rounded-3xl uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 shadow-2xl hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Zap size={16} fill="currentColor" /> Submit for District Audit</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}