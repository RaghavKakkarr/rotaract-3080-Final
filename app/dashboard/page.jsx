'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, User as UserIcon, CalendarPlus, CheckCircle, Trash2, 
  PlusCircle, RefreshCcw, Eye, Activity, Search, Phone, Droplets, IdCard, Building,
  Camera, ChevronDown, Users, AlertCircle, Clock, Trophy, Star, TrendingUp, Mail, 
  Download, ExternalLink, Image as ImageIcon, UploadCloud, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Note: heic2any ko humne yahan se hata diya hai build error fix karne ke liye

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function UnifiedDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  
  const [stats, setStats] = useState({ clubs: 0, members: 0, hours: 0 });
  const [clubs, setClubs] = useState([]);
  const [allMembers, setAllMembers] = useState([]); 
  const [allEvents, setAllEvents] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]); 
  const [nominations, setNominations] = useState([]); 
  
  const [drrEvent, setDrrEvent] = useState({ title: '', description: '', location: '', date: new Date().toISOString().split('T')[0] });
  const [drrImage, setDrrImage] = useState(null);
  const [drrPreview, setDrrPreview] = useState(null);

  const [newClub, setNewClub] = useState({ name: '', president: '', zone: '', sponsor: '', president_email: '' });
  
  const router = useRouter();
  const ADMIN_EMAIL = "rkakkar2003@gmail.com";

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        const currentUser = session.user;
        setUser(currentUser);
        const userIsAdmin = currentUser.email === ADMIN_EMAIL;
        setIsAdmin(userIsAdmin);
        
        if (userIsAdmin) {
          await fetchAdminData();
        } else {
          await fetchPresidentData(currentUser.email);
        }
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  async function fetchPresidentData(email) {
    const { data } = await supabase.from('notifications').select('*').eq('target_email', email).eq('is_read', false);
    setNotifications(data || []);
  }

  async function fetchAdminData() {
    setIsRefreshing(true);
    try {
      const { data: clubsData, count: cCount } = await supabase.from('clubs').select('*', { count: 'exact' }).order('name');
      const { data: mData, count: mCount } = await supabase.from('members').select('*', { count: 'exact' }).order('volunteer_hours', { ascending: false });
      const { data: allEventsData } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      const { data: nomData } = await supabase.from('members').select('*').eq('is_nominated', true);

      const totalH = mData?.reduce((acc, curr) => acc + (Number(curr.volunteer_hours) || 0), 0) || 0;

      setStats({ clubs: cCount || 0, members: mCount || 0, hours: totalH });
      setClubs(clubsData || []);
      setAllMembers(mData || []);
      setAllEvents(allEventsData || []); 
      setNominations(nomData || []);
      setPendingEvents(allEventsData?.filter(ev => !ev.is_approved) || []);
      setApprovedEvents(allEventsData?.filter(ev => ev.is_approved) || []);
    } catch (err) { console.error(err); } finally { setIsRefreshing(false); }
  }

  const handleDrrUpload = async (e) => {
    e.preventDefault();
    if (!drrImage) return alert("Please upload an official photo.");
    setIsRefreshing(true);
    
    let fileToUpload = drrImage;

    try {
      // 🍏 HEIC to JPG CONVERSION (DYNAMIC IMPORT)
      if (drrImage.name.toLowerCase().endsWith('.heic') || drrImage.type === 'image/heic') {
        if (typeof window !== 'undefined') {
          // Dynamic import for Build success
          const heic2any = (await import('heic2any')).default;
          
          const blob = await heic2any({
            blob: drrImage,
            toType: "image/jpeg",
            quality: 0.7
          });
          fileToUpload = new File(
            [Array.isArray(blob) ? blob[0] : blob], 
            drrImage.name.replace(/\.[^/.]+$/, "") + ".jpg", 
            { type: "image/jpeg" }
          );
        }
      }

      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `drr-official-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('events').upload(`drr-pics/${fileName}`, fileToUpload);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(`drr-pics/${fileName}`);
      
      const { error } = await supabase.from('events').insert([{
        ...drrEvent,
        club_name: 'RID 3080 OFFICIAL', service_avenue: 'District Broadcast', beneficiaries_count: 0,
        image_url: publicUrl, is_approved: true, created_at: new Date()
      }]);
      
      if (error) throw error;
      alert("Broadcast Deployed! 🚀");
      setDrrEvent({ title: '', description: '', location: '', date: new Date().toISOString().split('T')[0] });
      setDrrImage(null); setDrrPreview(null);
      fetchAdminData();
    } catch (err) { alert(err.message); } finally { setIsRefreshing(false); }
  };

  const downloadClubsList = () => {
    const doc = new jsPDF();
    doc.text("RID 3080: Club Directory", 14, 15);
    const tableBody = clubs.map((club, index) => [index + 1, club.name, club.zone, club.president]);
    autoTable(doc, { startY: 25, head: [['#', 'Club Name', 'Zone', 'President']], body: tableBody, headStyles: { fillColor: [244, 63, 94] } });
    doc.save("Clubs_Report.pdf");
  };

  const downloadMembersList = () => {
    const doc = new jsPDF('l');
    doc.text("RID 3080: Master Roster", 14, 15);
    const tableBody = allMembers.map((m, index) => [index + 1, m.name, m.club_name, m.district_id, m.phone, `${m.volunteer_hours} HRS`]);
    autoTable(doc, { startY: 25, head: [['#', 'Name', 'Club', 'ID', 'Phone', 'Hours']], body: tableBody, headStyles: { fillColor: [59, 130, 246] } });
    doc.save("Master_Roster.pdf");
  };

  const markRead = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredMembers = allMembers.filter(m => {
    const query = searchQuery.toLowerCase();
    return (m.name?.toLowerCase().includes(query) || m.club_name?.toLowerCase().includes(query) || m.district_id?.toLowerCase().includes(query));
  });

  const handleApprove = async (id) => {
    await supabase.from('events').update({ is_approved: true }).eq('id', id);
    fetchAdminData();
  };

  const handleDeleteEvent = async (id) => {
    if (confirm("Delete activity?")) { await supabase.from('events').delete().eq('id', id); fetchAdminData(); }
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('clubs').insert([newClub]);
    if (!error) { setNewClub({ name: '', president: '', zone: '', sponsor: '', president_email: '' }); fetchAdminData(); }
  };

  if (loading) return <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center text-rose-600 dark:text-rose-500 font-black animate-pulse uppercase tracking-widest">Establishing Secure Link...</div>;

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-32 px-6 pb-20 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <div className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl dark:shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-neutral-200 dark:border-white/10 ${isAdmin ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-500 shadow-sm' : 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500'}`}>
              {isAdmin ? <ShieldCheck size={32} /> : <UserIcon size={32} />}
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none text-neutral-900 dark:text-white">
                {isAdmin ? <>District <span className="text-rose-600 dark:text-rose-500 text-not-italic">Admin</span></> : <>Club <span className="text-blue-600 dark:text-blue-500 text-not-italic">President</span></>}
              </h1>
              <p className="text-neutral-400 text-[9px] font-black uppercase tracking-[0.3em] mt-2">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={isAdmin ? fetchAdminData : () => fetchPresidentData(user.email)} className={`p-4 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 transition-all hover:bg-neutral-100 dark:hover:bg-white/10 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`}><RefreshCcw size={20} /></button>
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 px-8 py-3 rounded-2xl font-black text-[10px] uppercase border border-red-200 dark:border-red-500/20 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white transition-all">Logout</button>
          </div>
        </div>

        {isAdmin ? (
          <div className="space-y-12">
            
            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-10 rounded-[3rem] shadow-sm flex items-center justify-between group overflow-hidden transition-all">
                <div className="relative z-10">
                  <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Registered Clubs</p>
                  <h3 className="text-6xl font-black tracking-tighter my-2 text-neutral-900 dark:text-white">{stats.clubs}</h3>
                  <button onClick={downloadClubsList} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-4 py-2 rounded-full border border-rose-200 dark:border-rose-500/20 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all">
                    <Download size={12} /> Club Directory
                  </button>
                </div>
                <Building size={64} className="text-rose-600 dark:text-rose-500 opacity-10 group-hover:opacity-20 transition-all duration-500" />
              </div>
              <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-10 rounded-[3rem] shadow-sm flex items-center justify-between group overflow-hidden transition-all">
                <div className="relative z-10">
                  <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">District Members</p>
                  <h3 className="text-6xl font-black tracking-tighter my-2 text-neutral-900 dark:text-white">{stats.members}</h3>
                  <button onClick={downloadMembersList} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-500/20 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all">
                    <Download size={12} /> Master Roster
                  </button>
                </div>
                <Users size={64} className="text-blue-600 dark:text-blue-500 opacity-10 group-hover:opacity-20 transition-all duration-500" />
              </div>
            </div>

            {/* BROADCAST STATION */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-10 rounded-[4rem] shadow-xl">
                 <h2 className="text-2xl font-black flex items-center gap-3 text-rose-600 dark:text-rose-500 uppercase italic tracking-tighter leading-none mb-8"><UploadCloud size={28}/> Official Broadcast</h2>
                 <form onSubmit={handleDrrUpload} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800 group hover:border-rose-500 transition-all cursor-pointer">
                        <input type="file" accept="image/*, .heic" onChange={(e) => { setDrrImage(e.target.files[0]); setDrrPreview(URL.createObjectURL(e.target.files[0])); }} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                        {drrPreview ? <img src={drrPreview} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 group-hover:text-rose-500"><ImageIcon size={40}/><p className="text-[9px] font-black uppercase">Official Photo (JPG/HEIC)</p></div>}
                      </div>
                    </div>
                    <div className="lg:col-span-8 space-y-4">
                      <input required type="text" placeholder="EVENT HEADLINE" value={drrEvent.title} onChange={e => setDrrEvent({...drrEvent, title: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-5 text-xl font-black uppercase text-neutral-900 dark:text-white outline-none focus:border-rose-500" />
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="date" value={drrEvent.date} onChange={e => setDrrEvent({...drrEvent, date: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:border-rose-500 uppercase" />
                        <input required type="text" placeholder="LOCATION" value={drrEvent.location} onChange={e => setDrrEvent({...drrEvent, location: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:border-rose-500 uppercase" />
                      </div>
                      <textarea required rows={4} placeholder="Description..." value={drrEvent.description} onChange={e => setDrrEvent({...drrEvent, description: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium italic text-neutral-900 dark:text-white outline-none focus:border-rose-500 resize-none" />
                      <button type="submit" className="bg-neutral-900 dark:bg-rose-600 text-white w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-600 dark:hover:bg-rose-500 transition-all shadow-xl">Deploy Broadcast</button>
                    </div>
                 </form>
            </div>

            {/* ANALYTICS GATEWAY */}
            <Link href="/dashboard/analytics" className="flex items-center justify-between p-10 rounded-[3rem] bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-rose-500/30 hover:border-rose-500 transition-all group shadow-xl">
              <div className="flex items-center gap-8">
                <div className="p-5 bg-rose-50 dark:bg-rose-500/10 rounded-3xl border border-rose-200 dark:border-rose-500/20">
                  <TrendingUp size={40} className="text-rose-600 dark:text-rose-500 group-hover:scale-125 transition-transform duration-500" />
                </div>
                <div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-1 text-neutral-900 dark:text-white">District Analytics</h2>
                  <p className="text-neutral-500 dark:text-neutral-400 text-[11px] font-black uppercase tracking-[0.2em]">Live Ranking • {stats.hours} Total Hours</p>
                </div>
              </div>
              <div className="hidden lg:block bg-neutral-900 dark:bg-rose-600 text-white dark:text-white px-10 py-5 rounded-2xl font-black text-xs uppercase hover:bg-rose-600 dark:hover:bg-rose-500 transition-all shadow-xl">Open God Mode</div>
            </Link>

            {/* MASTER ROSTER */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-8 rounded-[3.5rem] shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <h2 className="text-2xl font-black flex items-center gap-3 text-blue-600 dark:text-blue-400 uppercase italic tracking-tighter leading-none"><IdCard size={28}/> District Roster</h2>
                <div className="relative w-full md:w-[450px]">
                  <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="text" placeholder="Search Master Roster..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-bold focus:border-blue-500 outline-none text-neutral-900 dark:text-white transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[600px] overflow-y-auto pr-3">
                  {filteredMembers.map(m => (
                    <div key={m.id} className="bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200 dark:border-white/10 p-6 rounded-[2.5rem] hover:border-blue-500 transition-all group">
                      <div className="flex justify-between items-start">
                        <div className="max-w-[70%]">
                          <p className="font-black text-sm uppercase tracking-tight text-neutral-900 dark:text-white group-hover:text-blue-600">{m.name}</p>
                          <p className="text-[9px] text-neutral-400 font-black uppercase mt-1">{m.designation || 'Member'}</p>
                        </div>
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded italic">{m.volunteer_hours} HR</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 pt-4 border-t border-neutral-200 dark:border-white/5 text-[9px] font-bold text-neutral-500 uppercase mt-4">
                        <div className="flex items-center gap-2"><Building size={12}/> {m.club_name}</div>
                        <div className="flex items-center gap-2"><Phone size={12}/> {m.phone || 'N/A'}</div>
                        <div className="flex items-center gap-2"><Droplets size={12} className="text-rose-500"/> {m.blood_group}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* QUEUES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-[3.5rem] border border-neutral-200 dark:border-white/10 shadow-xl">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase italic text-rose-600 dark:text-rose-500"><Clock size={24}/> Approval Queue</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pendingEvents.map(ev => (
                    <div key={ev.id} className="bg-neutral-50 dark:bg-neutral-800/30 p-5 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between border border-neutral-200 dark:border-white/5 gap-4">
                      <div className="flex items-center gap-5">
                        <a href={ev.image_url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 text-neutral-400 hover:text-rose-600 transition-all"><ExternalLink size={20} /></a>
                        <div><p className="text-[10px] font-black text-rose-600 uppercase">{ev.club_name}</p><p className="text-xs font-bold text-neutral-900 dark:text-white uppercase mt-1">{ev.title}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(ev.id)} className="bg-neutral-900 dark:bg-rose-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 transition-all">Approve</button>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="bg-white dark:bg-red-500/10 text-red-500 p-3 rounded-xl border border-neutral-200 dark:border-red-500/20 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-[3.5rem] border border-neutral-200 dark:border-white/10 shadow-xl">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase italic text-green-600 dark:text-green-400"><Eye size={24}/> Live Activity</h2>
                <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                  {approvedEvents.map(ev => (
                    <div key={ev.id} className="bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200 dark:border-white/10 rounded-[2rem] p-6 flex justify-between items-center group">
                      <div>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${ev.club_name === 'RID 3080 OFFICIAL' ? 'text-rose-500' : 'text-green-600'}`}>{ev.club_name}</p>
                        <p className="text-sm font-bold uppercase text-neutral-900 dark:text-white leading-tight">{ev.title}</p>
                      </div>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="text-neutral-300 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* INFRASTRUCTURE */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-10 rounded-[4rem] shadow-xl">
                <h2 className="text-2xl font-black flex items-center gap-3 text-purple-600 dark:text-purple-400 uppercase italic tracking-tighter leading-none mb-10"><PlusCircle size={28}/> Infrastructure</h2>
                <form onSubmit={handleAddClub} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14 bg-neutral-50 dark:bg-neutral-800/30 p-8 rounded-[3rem] border border-neutral-200 dark:border-white/10 shadow-inner">
                    <input type="text" placeholder="Club Name" required value={newClub.name} onChange={e => setNewClub({...newClub, name: e.target.value})} className="bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-5 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:border-purple-500" />
                    <input type="text" placeholder="Zone" required value={newClub.zone} onChange={e => setNewClub({...newClub, zone: e.target.value})} className="bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-5 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:border-purple-500" />
                    <input type="email" placeholder="President Email" required value={newClub.president_email} onChange={e => setNewClub({...newClub, president_email: e.target.value})} className="bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-5 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:border-purple-500" />
                    <input type="text" placeholder="President Name" required value={newClub.president} onChange={e => setNewClub({...newClub, president: e.target.value})} className="bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-5 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:border-purple-500" />
                    <input type="text" placeholder="Sponsor Rotary" required value={newClub.sponsor} onChange={e => setNewClub({...newClub, sponsor: e.target.value})} className="bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-5 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:border-purple-500" />
                    <button type="submit" className="bg-neutral-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-all shadow-xl">Deploy Club</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {clubs.map(c => (
                        <div key={c.id} className="bg-white dark:bg-neutral-800/40 p-7 rounded-[3rem] border border-neutral-200 dark:border-white/10 flex flex-col group hover:border-purple-500 transition-all shadow-md">
                            <div className="flex justify-between items-start mb-6"><Building size={20} className="text-purple-600 dark:text-purple-400"/><span className="text-[10px] font-black text-neutral-400 uppercase">Zone {c.zone}</span></div>
                            <p className="font-black text-[13px] uppercase text-neutral-900 dark:text-neutral-200 mb-1">{c.name}</p><p className="text-[9px] text-neutral-400 font-bold uppercase">{c.president}</p>
                            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-white/5 flex justify-between items-center"><a href={`mailto:${c.president_email}`} className="text-neutral-400 hover:text-rose-500"><Mail size={16}/></a><Trash2 size={16} onClick={() => { if(confirm("Remove club?")) supabase.from('clubs').delete().eq('id', c.id).then(fetchAdminData) }} className="text-neutral-400 hover:text-red-500 cursor-pointer transition-colors" /></div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ) : (
          /* ================================================= PRESIDENT DASHBOARD ================================================= */
          <div className="space-y-12">
            {notifications.length > 0 && (
              <div className="space-y-4">
                {notifications.map(n => (
                  <div key={n.id} className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-8 rounded-[3rem] flex items-center justify-between shadow-lg backdrop-blur-sm">
                    <div className="flex items-center gap-6 text-red-600 dark:text-red-500"><AlertCircle size={32} /><div><p className="font-black uppercase text-[10px] tracking-widest">Alert</p><p className="text-xl font-bold italic text-neutral-900 dark:text-white">{n.message}</p></div></div>
                    <button onClick={() => markRead(n.id)} className="bg-neutral-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 transition-all">Dismiss</button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 text-center">
              {[
                { label: 'Members', icon: UserIcon, color: 'text-blue-600 dark:text-blue-500', href: '/dashboard/members', border: 'hover:border-blue-500' },
                { label: 'Events', icon: CalendarPlus, color: 'text-rose-600 dark:text-rose-500', href: '/dashboard/events', border: 'hover:border-rose-500' },
                { label: 'Analytics', icon: Activity, color: 'text-amber-600 dark:text-amber-500', href: '/dashboard/reports', border: 'hover:border-amber-500' },
              ].map((item, i) => (
                <Link key={i} href={item.href} className={`bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-14 rounded-[4.5rem] ${item.border} transition-all group shadow-xl backdrop-blur-sm`}>
                  <item.icon size={64} className={`${item.color} mb-8 mx-auto group-hover:scale-125 transition-transform duration-700`} />
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-3 text-neutral-900 dark:text-white">{item.label}</h2>
                  <p className="text-neutral-400 text-[11px] font-black uppercase tracking-[0.3em]">Quick Access</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}