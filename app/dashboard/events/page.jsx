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
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">
        <div className="relative z-[999] pt-6"> 
          <Link href="/dashboard" className="group text-rose-500 font-bold flex items-center gap-2 mb-8 hover:text-white transition-all uppercase tracking-widest text-[10px]">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
          </Link>
        </div>

        <div className="mb-12 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Live Pulse Reporting
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Capture <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 text-not-italic">Impact</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-rose-500/20 bg-rose-500/5 flex flex-col items-center justify-center p-10 text-center shadow-2xl">
              <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
                <FileCheck size={40} className="text-rose-500" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-white">Digital Evidence</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-relaxed mb-8">
                All projects are subject to strict verification by the District Intelligence Unit (DIU).
                <br/><br/>
                Host your high-quality event photos on <span className="text-white">Google Drive</span> or <span className="text-white">Instagram</span> and provide the public link for audit.
              </p>
              <div className="px-4 py-2 bg-black/40 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                <ShieldCheck size={12} /> DRR Audit Verification Required
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[4rem] shadow-3xl">
            
            <div className="space-y-8">
              <input 
                required type="text" 
                className="w-full bg-transparent border-b-2 border-white/10 py-4 focus:border-rose-500 outline-none transition-all text-3xl font-black italic uppercase tracking-tighter text-white"
                placeholder="WHAT HAPPENED?"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />

              <div className="flex items-center gap-4 bg-rose-500/5 rounded-3xl p-5 border border-rose-500/20 focus-within:border-rose-500/50 transition-all shadow-inner">
                 <div className="p-3 bg-rose-500/20 rounded-2xl"><LinkIcon size={20} className="text-rose-500" /></div>
                 <div className="flex flex-col flex-1">
                   <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Evidence Link (Drive/Instagram)</span>
                   <input 
                     required type="url" 
                     placeholder="Paste Public Link Here..." 
                     className="bg-transparent w-full outline-none text-xs font-bold text-white placeholder:text-neutral-600 mt-1" 
                     value={formData.proof_link}
                     onChange={(e) => setFormData({...formData, proof_link: e.target.value})} 
                   />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5">
                  <Calendar size={16} className="text-rose-500" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[7px] font-black text-neutral-500 uppercase tracking-widest">Event Date</span>
                    <input required type="date" value={formData.date} className="bg-transparent w-full outline-none text-[10px] font-black uppercase text-white cursor-pointer" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5 focus-within:border-rose-500/50 transition-all">
                  <MapPin size={16} className="text-rose-500" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[7px] font-black text-neutral-500 uppercase tracking-widest">Location</span>
                    <input required type="text" placeholder="CITY/VENUE" value={formData.location} className="bg-transparent w-full outline-none text-[10px] font-black uppercase text-white placeholder:text-neutral-700" onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5 focus-within:border-blue-500/50 transition-all">
                  <Layers size={16} className="text-blue-500" />
                  <div className="flex flex-col w-full flex-1">
                    <span className="text-[7px] font-black text-neutral-500 uppercase tracking-widest">Service Avenue</span>
                    <select 
                      required 
                      value={formData.service_avenue} 
                      className="bg-transparent outline-none text-[10px] font-black uppercase text-white cursor-pointer"
                      onChange={(e) => setFormData({...formData, service_avenue: e.target.value})}
                    >
                      <option value="" className="bg-black">SELECT AVENUE</option>
                      {avenues.map(a => <option key={a} value={a} className="bg-black">{a.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5 focus-within:border-green-500/50 transition-all">
                  <Users size={16} className="text-green-500" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[7px] font-black text-neutral-500 uppercase tracking-widest">Lives Impacted</span>
                    <input 
                      required 
                      type="number" 
                      placeholder="TOTAL BENEFICIARIES" 
                      className="bg-transparent w-full outline-none text-[10px] font-black uppercase text-white placeholder:text-neutral-700"
                      onChange={(e) => setFormData({...formData, beneficiaries_count: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5 col-span-1 md:col-span-2 opacity-50">
                  <Building size={16} className="text-white shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[7px] font-black text-white uppercase tracking-widest">Reporting Club</span>
                    <p className="text-[11px] font-black uppercase text-white truncate">{clubName || "SYNCING..."}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-2">Impact Summary</span>
                <textarea 
                  required rows={4}
                  placeholder="DESCRIBE THE IMPACT..."
                  value={formData.description}
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-8 py-8 focus:border-rose-500 outline-none transition-all text-sm font-medium italic resize-none shadow-inner"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button 
                disabled={loading} type="submit" 
                className="group relative w-full h-20 overflow-hidden rounded-3xl bg-white text-black font-black uppercase text-[12px] tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                  {loading ? <Loader2 className="animate-spin" /> : <><Zap size={18} fill="currentColor" /> Submit for DRR Audit</>}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}