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

  if (loading) return <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center text-rose-600 dark:text-rose-500 font-black italic animate-pulse uppercase tracking-widest">Verifying Roster...</div>;

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-28 px-6 pb-20 font-sans transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="relative z-[99]">
          <Link href="/dashboard" className="text-rose-600 dark:text-rose-500 font-bold flex items-center gap-2 mb-8 hover:text-black dark:hover:text-white transition-all uppercase tracking-widest text-[10px]">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
        {clubInfo ? (
          <>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 text-neutral-900 dark:text-white">
              Impact <span className="text-rose-600 dark:text-rose-500 text-not-italic">Tracking</span>
            </h1>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10 italic">
              {clubInfo.name} | Official Service Log
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* LEFT: INDIVIDUAL HOURS LOG */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl dark:shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Clock size={20} /> Member Service Hours
                    </h2>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-widest italic border border-blue-200 dark:border-blue-500/20">Mandatory Update</span>
                  </div>
                  
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {members.length === 0 ? (
                      <p className="text-neutral-500 text-sm italic py-10 text-center">No members found in your roster. Please add members first.</p>
                    ) : (
                      members.map((member) => (
                        <div key={member.id} className="bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-blue-400 dark:hover:border-blue-500/30 transition-all shadow-sm dark:shadow-none">
                          <div>
                            <p className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white">{member.name}</p>
                            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-tighter">{member.district_id}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <input 
                              type="number" 
                              defaultValue={member.volunteer_hours}
                              onBlur={(e) => handleHourUpdate(member.id, e.target.value)}
                              className="w-20 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 rounded-lg px-2 py-2 text-center text-sm font-bold focus:border-blue-500 outline-none transition-all text-blue-600 dark:text-blue-400 shadow-inner dark:shadow-none"
                              placeholder="0"
                            />
                            <span className="text-[10px] font-black text-neutral-400 uppercase">Hrs</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: ROM NOMINATION */}
              <div className="space-y-6">
                <div className={`bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl dark:shadow-2xl transition-all ${!isNominationOpen ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-6 uppercase italic tracking-tighter">
                    <Award size={20} /> Nominate ROM
                  </h2>
                  {!isNominationOpen && (
                    <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 p-4 rounded-xl text-[10px] font-black uppercase mb-6 flex items-start gap-2 border border-amber-200 dark:border-amber-500/20 shadow-sm">
                      <Lock size={16} className="shrink-0" />
                      Window Opens: 25th of {nominationData.month}
                    </div>
                  )}
                  <form onSubmit={handleNominationSubmit} className="space-y-4">
                    <select 
                      required 
                      value={nominationData.rotaractor_name}
                      onChange={e => setNominationData({...nominationData, rotaractor_name: e.target.value})}
                      className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-amber-500 text-neutral-900 dark:text-white appearance-none"
                    >
                      <option value="" className="bg-white dark:bg-neutral-900">Select Nominee</option>
                      {members.map(m => <option key={m.id} value={m.name} className="bg-white dark:bg-neutral-900">{m.name}</option>)}
                    </select>
                    <textarea 
                      required 
                      rows="4"
                      placeholder="Citation for nomination..."
                      value={nominationData.achievements}
                      onChange={e => setNominationData({...nominationData, achievements: e.target.value})}
                      className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 resize-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-700"
                    ></textarea>
                    <button className="w-full bg-amber-600 hover:bg-amber-500 text-white dark:text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg">Submit Nomination</button>
                  </form>
                  {status && <p className="text-green-600 dark:text-green-400 text-[10px] mt-4 font-black uppercase text-center animate-bounce">{status}</p>}
                </div>
              </div>

            </div>
          </>
        ) : (
          <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 p-12 rounded-[3rem] text-center shadow-lg transition-all">
             <ShieldAlert className="mx-auto text-red-600 dark:text-red-500 mb-6" size={60} />
             <h2 className="text-red-600 dark:text-red-500 font-black text-2xl mb-3 italic uppercase">Access Restricted</h2>
             <p className="text-neutral-500 text-sm italic max-w-sm mx-auto">
               Your account is not linked to an official club roster. Hours cannot be logged.
             </p>
          </div>
        )}
      </div>
    </main>
  );
}