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
    "Club Service", "Community Service", "International Service", 
    "Professional Development", "Vocational Service", "Public Image"
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
    if (!formData.proof_link || !formData.service_avenue || !clubName) return alert("All fields are mandatory.");
    
    setLoading(true);
    try {
      const { error } = await supabase.from('events').insert([
        {
          ...formData,
          beneficiaries_count: parseInt(formData.beneficiaries_count) || 0, 
          club_name: clubName,
          image_url: formData.proof_link, 
          is_approved: false, 
          created_at: new Date(),
        },
      ]);
      if (error) throw error;
      alert("Sent for approval! 🚀");
      router.push('/dashboard');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 👇 SPACE FIX: pt-4 for mobile, md:pt-10 for desktop
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-4 md:pt-10 pb-20 px-4 md:px-6 font-sans transition-colors duration-300 overflow-x-hidden">
      
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/5 via-transparent to-transparent -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* HEADER - Reduced mb-6 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-neutral-500 hover:text-rose-600 dark:hover:text-rose-500 transition-colors text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-neutral-100 dark:bg-white/5 px-3 py-2 md:px-4 md:py-3 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20">
              <ArrowLeft size={14} md={16} /> Back
            </Link>
            <div>
              <h1 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter leading-none">
                Submit <span className="text-rose-600 dark:text-rose-500 text-not-italic">Activity</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles size={10} className="text-rose-500" />
                <p className="text-neutral-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] leading-none">Reporting Pulse</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm group">
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <FileCheck size={24} className="text-rose-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-4 text-neutral-900 dark:text-white">Audit Trail</h3>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-500 leading-relaxed mb-6">
                Verification by District Intelligence Required. Use <span className="text-rose-600">Google Drive</span> links.
              </p>
              <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase text-neutral-400 border-t border-neutral-100 dark:border-white/5 pt-4">
                <ShieldCheck size={12} md={14} className="text-rose-600" /> DRR Verification Required
              </div>
            </div>
          </div>

          {/* FORM AREA */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8 bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-6 md:p-14 rounded-[2.5rem] md:rounded-[4rem] shadow-sm">
            
            <div className="space-y-8">
              {/* Title */}
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 ml-4 tracking-widest italic">Headline</label>
                <input required type="text" className="w-full bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-5 md:py-6 outline-none focus:border-rose-500 transition-all text-xl md:text-2xl font-black italic uppercase tracking-tighter" placeholder="WHAT HAPPENED?" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>

              {/* Evidence Link */}
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase text-rose-500 ml-4 italic">Proof Link</label>
                <div className="relative group">
                   <LinkIcon size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500" />
                   <input required type="url" placeholder="Drive or Insta URL..." className="w-full bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-full py-4 md:py-5 pl-14 pr-6 outline-none focus:border-rose-500 text-[10px] md:text-xs font-bold" value={formData.proof_link} onChange={(e) => setFormData({...formData, proof_link: e.target.value})} />
                </div>
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[
                  { l: 'Date', i: Calendar, k: 'date', t: 'date' },
                  { l: 'Venue', i: MapPin, k: 'location', t: 'text', p: 'CITY' },
                  { l: 'Avenue', i: Layers, k: 'service_avenue', t: 'select' },
                  { l: 'Beneficiaries', i: Users, k: 'beneficiaries_count', t: 'number', p: 'TOTAL' },
                ].map((f) => (
                  <div key={f.k} className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 ml-4 italic">{f.l}</label>
                    <div className="flex items-center gap-3 bg-neutral-100 dark:bg-white/5 rounded-2xl p-4 md:p-5 border border-neutral-200 dark:border-white/5">
                      <f.i size={16} className="text-rose-600" />
                      {f.t === 'select' ? (
                        <select required value={formData.service_avenue} className="bg-transparent outline-none text-[10px] md:text-[11px] font-black uppercase w-full" onChange={(e) => setFormData({...formData, service_avenue: e.target.value})}>
                          <option value="">SELECT AVENUE</option>
                          {avenues.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                        </select>
                      ) : (
                        <input required type={f.t} placeholder={f.p} value={formData[f.k]} className="bg-transparent w-full outline-none text-[10px] md:text-[11px] font-black uppercase" onChange={(e) => setFormData({...formData, [f.k]: e.target.value})} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Impact Summary */}
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 ml-4 italic">Impact Summary</label>
                <textarea required rows={4} placeholder="DESCRIBE THE OUTCOME..." value={formData.description} className="w-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-[2rem] md:rounded-[3rem] px-6 md:px-8 py-6 md:py-8 focus:border-rose-500 outline-none text-sm italic resize-none" onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-black py-5 md:py-6 rounded-2xl md:rounded-3xl uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[11px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : <><Zap size={16} fill="currentColor" /> Submit for Audit</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}