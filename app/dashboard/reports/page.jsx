'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, Clock, Send, Lock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function IndividualReporting() {
  const [members, setMembers] = useState([]);
  const [clubInfo, setClubInfo] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isNominationOpen, setIsNominationOpen] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();
  
  const [nominationData, setNominationData] = useState({
    rotaractor_name: '',
    achievements: '',
    month: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date())
  });

  useEffect(() => {
    const today = new Date();
    if (today.getDate() >= 25) setIsNominationOpen(true);
    fetchClubAndMembers();
  }, []);

  async function fetchClubAndMembers() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: clubData } = await supabase
      .from('clubs')
      .select('name, zone')
      .eq('president_email', session.user.email)
      .single();

    if (clubData) {
      setClubInfo(clubData);
      const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .eq('club_name', clubData.name) 
        .order('name', { ascending: true });
      
      if (membersData) setMembers(membersData);
    }
    setLoading(false);
  }

  const handleHourUpdate = async (id, hours) => {
    const { error } = await supabase
      .from('members')
      .update({ volunteer_hours: hours })
      .eq('id', id);
    
    if (!error) {
      setMembers(members.map(m => m.id === id ? { ...m, volunteer_hours: hours } : m));
    }
  };

  const handleNominationSubmit = async (e) => {
    e.preventDefault();
    if (!clubInfo) return;

    const { error } = await supabase.from('monthly_reports').insert([{
      ...nominationData,
      club_name: clubInfo.name
    }]);

    if (!error) {
        setStatus('Nomination Submitted! 🏆');
        setNominationData({ ...nominationData, rotaractor_name: '', achievements: '' });
    }
  };

  if (loading) return <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center text-rose-600 dark:text-rose-500 font-black italic animate-pulse uppercase tracking-widest px-6 text-center text-sm">Verifying Roster...</div>;

  return (
    // 👇 FIX: pt-20 for mobile, pt-10 for desktop (Dashboard Standard)
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-20 md:pt-10 px-4 md:px-6 pb-20 font-sans transition-colors duration-300 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* UNIFIED HEADER - Responsive Padding */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-neutral-500 hover:text-amber-600 transition-colors text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-neutral-100 dark:bg-white/5 px-3 py-2 md:px-4 md:py-3 rounded-xl">
              <ArrowLeft size={14} md={16} /> Back
            </Link>
            <div>
              <h1 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter leading-none">
                Impact <span className="text-amber-600 dark:text-amber-500 text-not-italic">Tracking</span>
              </h1>
              <p className="text-neutral-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mt-1 line-clamp-1">
                {clubInfo?.name || "Official Service Log"}
              </p>
            </div>
          </div>
        </div>

        {clubInfo ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
            
            {/* LEFT: INDIVIDUAL HOURS LOG - Main focus on Mobile */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Clock size={20} /> Member Service
                  </h2>
                  <span className="text-[8px] md:text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full font-black uppercase tracking-widest italic w-fit">Update Monthly</span>
                </div>
                
                <div className="space-y-3 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                  {members.length === 0 ? (
                    <p className="text-neutral-500 text-sm italic py-10 text-center">Roster empty. Please add members.</p>
                  ) : (
                    members.map((member) => (
                      <div key={member.id} className="bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 group">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm tracking-tight truncate">{member.name}</p>
                          <p className="text-[9px] text-neutral-500 font-black uppercase truncate">{member.district_id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            defaultValue={member.volunteer_hours}
                            onBlur={(e) => handleHourUpdate(member.id, e.target.value)}
                            className="w-16 md:w-20 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 rounded-lg px-2 py-2 text-center text-sm font-bold focus:border-blue-500 outline-none text-blue-600"
                            placeholder="0"
                          />
                          <span className="text-[9px] font-black text-neutral-400 uppercase">Hrs</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: ROM NOMINATION */}
            <div className="space-y-6">
              <div className={`bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm transition-all ${!isNominationOpen ? 'opacity-50 grayscale' : ''}`}>
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-amber-600 mb-6 uppercase italic tracking-tighter leading-tight">
                  <Award size={20} /> Nominate ROM
                </h2>
                {!isNominationOpen && (
                  <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 p-4 rounded-xl text-[9px] font-black uppercase mb-6 flex items-start gap-2 border border-amber-200">
                    <Lock size={14} className="shrink-0" />
                    Window: 25th - EOM
                  </div>
                )}
                <form onSubmit={handleNominationSubmit} className="space-y-4">
                  <select 
                    required 
                    value={nominationData.rotaractor_name}
                    onChange={e => setNominationData({...nominationData, rotaractor_name: e.target.value})}
                    className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-amber-500 text-neutral-900 dark:text-white"
                  >
                    <option value="">Select Nominee</option>
                    {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                  <textarea 
                    required 
                    rows="3"
                    placeholder="Citation..."
                    value={nominationData.achievements}
                    onChange={e => setNominationData({...nominationData, achievements: e.target.value})}
                    className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 resize-none"
                  ></textarea>
                  <button className="w-full bg-amber-600 text-white dark:text-black font-black py-4 rounded-xl text-[9px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Submit</button>
                </form>
                {status && <p className="text-green-600 text-[9px] mt-4 font-black uppercase text-center animate-pulse">{status}</p>}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 p-10 rounded-[2rem] text-center">
             <ShieldAlert className="mx-auto text-red-600 mb-4" size={48} />
             <h2 className="text-red-600 font-black text-xl mb-2 uppercase">Access Restricted</h2>
             <p className="text-neutral-500 text-xs italic">Account not linked to a club roster.</p>
          </div>
        )}
      </div>
    </main>
  );
}