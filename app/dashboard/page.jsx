'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { 
  LogOut, User as UserIcon, Users, CalendarPlus, Award, 
  ShieldCheck, Building, Clock, CheckCircle, Trash2, 
  PlusCircle, Star, RefreshCcw, Camera, Send, Eye 
} from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function UnifiedDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({ clubs: 0, members: 0, hours: 0 });
  const [clubs, setClubs] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]); 
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]); 
  
  // DRR Special Event States
  const [drrEvent, setDrrEvent] = useState({ title: '', description: '', project_date: new Date().toISOString().split('T')[0] });
  const [imageFile, setImageFile] = useState(null);
  
  // Club Management State
  const [newClub, setNewClub] = useState({ name: '', president: '', zone: '', sponsor: '', president_email: '' });
  
  const router = useRouter();
  const ADMIN_EMAIL = "rkakkar2003@gmail.com";

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        const isUserAdmin = session.user.email === ADMIN_EMAIL;
        setIsAdmin(isUserAdmin);
        if (isUserAdmin) fetchAdminData();
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  async function fetchAdminData() {
    setIsRefreshing(true);
    try {
      const { data: clubsData, count: cCount } = await supabase.from('clubs').select('*', { count: 'exact' }).order('name');
      const { data: mData, count: mCount } = await supabase.from('members').select('*', { count: 'exact' });
      
      const totalHours = mData?.reduce((acc, curr) => acc + (Number(curr.volunteer_hours) || 0), 0) || 0;
      const sorted = mData ? [...mData].sort((a, b) => (b.volunteer_hours || 0) - (a.volunteer_hours || 0)).slice(0, 10) : [];
      
      const { data: allEvents } = await supabase.from('events').select('*').order('created_at', { ascending: false });

      setStats({
        clubs: cCount || 0,
        members: mCount || 0,
        hours: totalHours
      });
      
      setClubs(clubsData || []);
      setTopPerformers(sorted);
      setPendingEvents(allEvents?.filter(ev => !ev.is_approved) || []);
      setApprovedEvents(allEvents?.filter(ev => ev.is_approved) || []);

    } catch (err) {
      console.error("Sync Error:", err.message);
    } finally {
      setIsRefreshing(false);
    }
  }

  // --- DRR SPECIAL: POST DISTRICT EVENT ---
  const handleDrrEventSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select a photo!");
    setIsRefreshing(true);
    try {
      const fileName = `dist_${Date.now()}.${imageFile.name.split('.').pop()}`;
      await supabase.storage.from('event-images').upload(`district/${fileName}`, imageFile);
      const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(`district/${fileName}`);

      await supabase.from('events').insert([{ 
        ...drrEvent, 
        image_url: publicUrl, 
        club_name: "District 3080", 
        is_approved: true 
      }]);
      
      setDrrEvent({ title: '', description: '', project_date: new Date().toISOString().split('T')[0] });
      setImageFile(null);
      fetchAdminData();
      alert("District Event Published! 🚀");
    } catch (err) { alert(err.message); } finally { setIsRefreshing(false); }
  };

  // --- ACTIONS ---
  const handleAddClub = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('clubs').insert([newClub]);
    if (!error) {
      setNewClub({ name: '', president: '', zone: '', sponsor: '', president_email: '' });
      fetchAdminData();
    } else { alert(error.message); }
  };

  const handleDeleteClub = async (id) => {
    if (confirm("Delete Club?")) {
      await supabase.from('clubs').delete().eq('id', id);
      fetchAdminData();
    }
  };

  const handleApprove = async (id) => {
    await supabase.from('events').update({ is_approved: true }).eq('id', id);
    fetchAdminData();
  };

  const handleDeleteEvent = async (id) => {
    if (confirm("Delete event?")) {
      await supabase.from('events').delete().eq('id', id);
      fetchAdminData();
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-rose-500 font-black italic animate-pulse tracking-widest">RID 3080 PORTAL SYNCING...</div>;

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 px-6 pb-20 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center border border-white/10"><ShieldCheck size={32} /></div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">District <span className="text-rose-500 text-not-italic">Admin</span></h1>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchAdminData} className={`p-4 rounded-2xl border border-white/10 bg-white/5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`}><RefreshCcw size={20} /></button>
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="bg-red-500/10 text-red-500 px-8 py-3 rounded-2xl font-black text-xs uppercase border border-red-500/20 hover:bg-red-600 transition-all">Logout</button>
          </div>
        </div>

        {isAdmin ? (
          <div className="space-y-12">
            {/* 1. STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Registered Clubs', val: stats.clubs, ic: Building, col: 'text-blue-400' },
                { label: 'Total Members', val: stats.members, ic: Users, col: 'text-purple-400' },
                { label: 'Total Hours', val: stats.hours, ic: Clock, col: 'text-amber-400' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                  <s.ic size={28} className={`${s.col} mb-4`} />
                  <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-5xl font-black tracking-tighter">{s.val}</h3>
                </div>
              ))}
            </div>

            {/* 2. DRR: POST DISTRICT EVENT (Returned!) */}
            <div className="bg-white/[0.03] border border-rose-500/20 p-8 rounded-[2.5rem] shadow-2xl">
                <h2 className="text-xl font-black mb-8 flex items-center gap-2 text-rose-500 uppercase italic tracking-tighter"><CalendarPlus size={24}/> Post District Event</h2>
                <form onSubmit={handleDrrEventSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Official Event Title" required value={drrEvent.title} onChange={e => setDrrEvent({...drrEvent, title: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none" />
                            <input type="date" required value={drrEvent.project_date} onChange={e => setDrrEvent({...drrEvent, project_date: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none" />
                        </div>
                        <textarea placeholder="Event summary for public gallery..." rows="3" required value={drrEvent.description} onChange={e => setDrrEvent({...drrEvent, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none resize-none"></textarea>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="relative border border-dashed border-white/10 rounded-xl flex items-center justify-center bg-black/50 h-full min-h-[100px] hover:border-rose-500/50">
                            <input type="file" accept="image/*" required onChange={e => setImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <span className="text-[10px] font-black text-neutral-500">{imageFile ? imageFile.name.substring(0,10) : "Upload Photo"}</span>
                        </div>
                        <button type="submit" disabled={isRefreshing} className="bg-white text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Publish Official Post</button>
                    </div>
                </form>
            </div>

            {/* 3. GALLERY & QUEUE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-xl">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase italic text-blue-400 tracking-tighter"><Eye size={24}/> Live Gallery ({approvedEvents.length})</h2>
                    <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {approvedEvents.map(ev => (
                            <div key={ev.id} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden group">
                                <img src={ev.image_url} className="h-24 w-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="p-3 flex justify-between items-center"><p className="text-[8px] font-black uppercase truncate max-w-[80px]">{ev.title}</p><button onClick={() => handleDeleteEvent(ev.id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded-md"><Trash2 size={14}/></button></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-xl">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase italic text-rose-500 tracking-tighter"><CheckCircle size={24}/> Pending Queue</h2>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {pendingEvents.length === 0 ? <p className="text-center py-10 text-neutral-600 italic">Queue clear.</p> : pendingEvents.map(ev => (
                            <div key={ev.id} className="bg-black/40 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-3">
                                    <img src={ev.image_url} className="w-10 h-10 rounded-lg object-cover" />
                                    <div><p className="text-[10px] font-black text-rose-500 uppercase">{ev.club_name}</p><p className="text-xs font-bold truncate max-w-[100px]">{ev.title}</p></div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApprove(ev.id)} className="bg-rose-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">Approve</button>
                                    <button onClick={() => handleDeleteEvent(ev.id)} className="bg-white/5 text-red-500 p-2 rounded-lg"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. CLUB DIRECTORY */}
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem]">
                <h2 className="text-xl font-black mb-8 flex items-center gap-2 text-rose-500 uppercase italic tracking-tighter"><PlusCircle size={24}/> Club Management</h2>
                <form onSubmit={handleAddClub} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    <input type="text" placeholder="Club Name" required value={newClub.name} onChange={e => setNewClub({...newClub, name: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
                    <input type="text" placeholder="Zone" required value={newClub.zone} onChange={e => setNewClub({...newClub, zone: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
                    <input type="email" placeholder="President Email" required value={newClub.president_email} onChange={e => setNewClub({...newClub, president_email: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
                    <input type="text" placeholder="President Name" required value={newClub.president} onChange={e => setNewClub({...newClub, president: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
                    <input type="text" placeholder="Sponsor Rotary" required value={newClub.sponsor} onChange={e => setNewClub({...newClub, sponsor: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
                    <button type="submit" className="bg-white text-black font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Add Club</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {clubs.map(c => (
                        <div key={c.id} className="bg-black/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center group">
                            <div><p className="font-black text-xs uppercase tracking-tight">{c.name}</p><p className="text-[8px] text-neutral-500 font-bold uppercase">Zone {c.zone} | {c.president}</p></div>
                            <button onClick={() => handleDeleteClub(c.id)} className="text-neutral-700 hover:text-red-500 p-2 transition-all"><Trash2 size={16}/></button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ) : (
          /* CLUB DASHBOARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/dashboard/members" className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:border-blue-500/50 transition-all text-center">
              <Users size={48} className="text-blue-500 mb-6 mx-auto" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Members</h2>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">Registry</p>
            </Link>
            <Link href="/dashboard/events" className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:border-rose-500/50 transition-all text-center">
              <CalendarPlus size={48} className="text-rose-500 mb-6 mx-auto" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Events</h2>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">Upload</p>
            </Link>
            <Link href="/dashboard/reports" className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:border-amber-500/50 transition-all text-center">
              <Award size={48} className="text-amber-500 mb-6 mx-auto" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Reporting</h2>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">Hours</p>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}