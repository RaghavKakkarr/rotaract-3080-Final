'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft, Trash2, IdCard, Loader2, ShieldAlert, Hash, Droplets, Phone } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [newMember, setNewMember] = useState({ 
    name: '', 
    designation: '', 
    ri_id: '', 
    blood_group: '', 
    phone: '' 
  });
  
  const router = useRouter();

  useEffect(() => {
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

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!clubInfo) return;

    const districtId = `RID3080-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const { error } = await supabase.from('members').insert([{
      ...newMember,
      club_name: clubInfo.name,
      district_id: districtId,
      volunteer_hours: 0
    }]);

    if (!error) {
      setNewMember({ name: '', designation: '', ri_id: '', blood_group: '', phone: '' });
      fetchClubAndMembers();
    } else {
        alert("Error: " + error.message);
    }
  };

  const deleteMember = async (id) => {
    if(confirm("Permanently delete this member from District Roster?")) {
      await supabase.from('members').delete().eq('id', id);
      fetchClubAndMembers();
    }
  };

  if (loading) return <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center text-rose-600 dark:text-rose-500 font-black animate-pulse uppercase tracking-widest">Loading Roster...</div>;

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-28 px-6 pb-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="relative z-[99]">
          <Link href="/dashboard" className="text-rose-600 dark:text-rose-500 font-bold flex items-center gap-2 mb-8 hover:text-black dark:hover:text-white transition-all uppercase tracking-widest text-[10px]">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        {clubInfo ? (
          <>
            <div className="mb-10">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-neutral-900 dark:text-white">
                {clubInfo.name} <span className="text-rose-600 dark:text-rose-500">Member Registry</span>
              </h1>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                District 3080 • Zone {clubInfo.zone}
              </p>
            </div>

            {/* 🎯 DETAILED REGISTRATION FORM */}
            <form onSubmit={handleAddMember} className="bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 p-8 rounded-[2.5rem] mb-12 shadow-xl dark:shadow-2xl transition-all">
              <h3 className="text-sm font-black uppercase tracking-widest text-rose-600 dark:text-rose-500 mb-6 flex items-center gap-2">
                <UserPlus size={18}/> New Enrollment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 ml-1">Full Name</label>
                  <input type="text" placeholder="Member Name" required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 ml-1">Designation</label>
                  <input type="text" placeholder="e.g. Vice President" required value={newMember.designation} onChange={e => setNewMember({...newMember, designation: e.target.value})} className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 ml-1">RI ID (If any)</label>
                  <input type="text" placeholder="Rotary International ID" value={newMember.ri_id} onChange={e => setNewMember({...newMember, ri_id: e.target.value})} className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 ml-1">Phone Number</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" required value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 ml-1">Blood Group</label>
                  <select required value={newMember.blood_group} onChange={e => setNewMember({...newMember, blood_group: e.target.value})} className="w-full bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none appearance-none text-neutral-900 dark:text-white">
                    <option value="" className="bg-white dark:bg-black">Select Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg} className="bg-white dark:bg-black">{bg}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-black py-3 rounded-xl hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all text-xs uppercase tracking-widest shadow-lg">
                    Register Member
                  </button>
                </div>
              </div>
            </form>

            {/* MEMBERS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {members.map(m => (
                <div key={m.id} className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-6 rounded-[2rem] hover:border-rose-400 dark:hover:border-rose-500/30 transition-all group shadow-md dark:shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 rounded-2xl flex items-center justify-center border border-rose-200 dark:border-rose-500/20 group-hover:bg-rose-600 dark:group-hover:bg-rose-500 group-hover:text-white transition-all shadow-inner">
                        <IdCard size={24}/>
                      </div>
                      <div>
                        <p className="font-bold text-lg leading-tight text-neutral-900 dark:text-white">{m.name}</p>
                        <p className="text-[10px] text-rose-600 dark:text-rose-500 font-black uppercase tracking-widest">{m.designation}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteMember(m.id)} className="text-neutral-300 hover:text-red-500 p-2 transition-colors"><Trash2 size={18}/></button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 dark:border-white/5 pt-4 text-[10px] font-bold uppercase tracking-tighter">
                    <div className="flex items-center gap-2 text-neutral-500">
                        <Hash size={12} className="text-rose-600 dark:text-rose-500" /> RI ID: <span className="text-neutral-900 dark:text-white ml-auto">{m.ri_id || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                        <Droplets size={12} className="text-rose-600 dark:text-rose-500" /> Blood: <span className="text-neutral-900 dark:text-white ml-auto">{m.blood_group}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                        <Phone size={12} className="text-rose-600 dark:text-rose-500" /> Call: <span className="text-neutral-900 dark:text-white ml-auto">{m.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                        <IdCard size={12} className="text-rose-600 dark:text-rose-500" /> Dist ID: <span className="text-neutral-900 dark:text-white ml-auto">{m.district_id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
            <div className="text-center py-20 bg-red-50 dark:bg-red-500/5 rounded-3xl border border-red-200 dark:border-red-500/20">
                <ShieldAlert className="mx-auto text-red-600 dark:text-red-500 mb-4" size={50} />
                <h2 className="text-red-600 dark:text-red-500 font-black uppercase italic">Access Denied</h2>
                <p className="text-neutral-500 text-sm">Mapping not found for your email.</p>
            </div>
        )}
      </div>
    </main>
  );
}