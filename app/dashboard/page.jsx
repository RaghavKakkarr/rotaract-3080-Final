'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, User as UserIcon, CalendarPlus, CheckCircle, Trash2, 
  PlusCircle, RefreshCcw, Eye, Activity, Search, Phone, Droplets, IdCard, Building,
  Camera, ChevronDown, Users, AlertCircle, Clock, Trophy, Star, TrendingUp, Mail, 
  Download, ExternalLink, Image as ImageIcon, UploadCloud, Sparkles // 👈 Sparkles yahan add kar diya
} from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function UnifiedDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  
  // Data States
  const [stats, setStats] = useState({ clubs: 0, members: 0, hours: 0 });
  const [clubs, setClubs] = useState([]);
  const [allMembers, setAllMembers] = useState([]); 
  const [allEvents, setAllEvents] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]); 
  const [nominations, setNominations] = useState([]); 
  
  // 🎯 DRR Official Upload States
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

  // 🎯 DRR OFFICIAL EVENT UPLOAD LOGIC
  const handleDrrUpload = async (e) => {
    e.preventDefault();
    if (!drrImage) return alert("Please upload an official photo for the District Gallery.");
    
    setIsRefreshing(true);
    try {
      const fileExt = drrImage.name.split('.').pop();
      const fileName = `drr-official-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('events').upload(`drr-pics/${fileName}`, drrImage);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(`drr-pics/${fileName}`);

      const { error } = await supabase.from('events').insert([{
        title: drrEvent.title,
        description: drrEvent.description,
        location: drrEvent.location,
        date: drrEvent.date,
        club_name: 'RID 3080 OFFICIAL', 
        service_avenue: 'District Broadcast',
        beneficiaries_count: 0,
        image_url: publicUrl,
        is_approved: true, 
        created_at: new Date()
      }]);

      if (error) throw error;
      alert("District Broadcast Deployed! 🚀");
      setDrrEvent({ title: '', description: '', location: '', date: new Date().toISOString().split('T')[0] });
      setDrrImage(null); setDrrPreview(null);
      fetchAdminData();
    } catch (err) {
      alert("Upload Failed: " + err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const downloadClubsList = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("RID 3080: Master Club Directory & Impact", 14, 15);
    
    const tableBody = clubs.map((club, index) => {
      const clubEvents = allEvents.filter(ev => ev.club_name === club.name && ev.is_approved);
      const clubMembers = allMembers.filter(m => m.club_name === club.name); 
      const totalImpact = clubEvents.reduce((acc, curr) => acc + (Number(curr.beneficiaries_count) || 0), 0);
      const totalHours = clubMembers.reduce((acc, curr) => acc + (Number(curr.volunteer_hours) || 0), 0);
      
      return [index + 1, club.name, club.zone, clubMembers.length, clubEvents.length, totalImpact, `${totalHours} HRS`];
    });

    autoTable(doc, {
      startY: 25,
      head: [['#', 'Club Name', 'Zone', 'Members', 'Projects', 'Impact', 'Total Hours']], 
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [244, 63, 94] }
    });
    doc.save("District_Clubs_Impact_Report.pdf");
  };

  const downloadMembersList = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); 
    doc.setFontSize(18);
    doc.text("RID 3080: Complete District Member Roster", 14, 15);
    
    const tableBody = allMembers.map((m, index) => [
      index + 1,
      m.name,
      m.club_name,
      m.district_id || 'N/A',
      m.phone || 'N/A',
      m.blood_group || 'N/A',
      `${m.volunteer_hours || 0} HRS`
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['#', 'Member Name', 'Club', 'District ID', 'Phone', 'Blood Group', 'Hours']],
      body: tableBody,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    doc.save("District_Master_Roster.pdf");
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
    if (confirm("Permanently delete this activity?")) {
      await supabase.from('events').delete().eq('id', id);
      fetchAdminData();
    }
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('clubs').insert([newClub]);
    if (!error) { 
        setNewClub({ name: '', president: '', zone: '', sponsor: '', president_email: '' }); 
        fetchAdminData();
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-rose-500 font-black animate-pulse tracking-widest uppercase">Establishing Secure Link...</div>;

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 px-6 pb-20 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 ${isAdmin ? 'bg-rose-500/20 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'bg-blue-500/20 text-blue-500'}`}>
              {isAdmin ? <ShieldCheck size={32} /> : <UserIcon size={32} />}
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                {isAdmin ? <>District <span className="text-rose-500 text-not-italic">Admin</span></> : <>Club <span className="text-blue-500 text-not-italic">President</span></>}
              </h1>
              <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={isAdmin ? fetchAdminData : () => fetchPresidentData(user.email)} className={`p-4 rounded-2xl border border-white/10 bg-white/5 transition-all hover:bg-white/10 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`}><RefreshCcw size={20} /></button>
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="bg-red-500/10 text-red-500 px-8 py-3 rounded-2xl font-black text-[10px] uppercase border border-red-500/20 hover:bg-red-600 transition-all">Logout</button>
          </div>
        </div>

        {isAdmin ? (
          /* ================================================= ADMIN DASHBOARD ================================================= */
          <div className="space-y-12">
            
            {/* TOP STATS & DOWNLOADS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-inner flex items-center justify-between group relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Registered Clubs</p>
                  <h3 className="text-6xl font-black tracking-tighter my-2">{stats.clubs}</h3>
                  <button onClick={downloadClubsList} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-white transition-colors bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                    <Download size={12} /> Get Club Directory
                  </button>
                </div>
                <Building size={64} className="text-rose-500 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 relative z-10" />
              </div>
              
              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-inner flex items-center justify-between group relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">District Members</p>
                  <h3 className="text-6xl font-black tracking-tighter my-2">{stats.members}</h3>
                  <button onClick={downloadMembersList} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                    <Download size={12} /> Get Roster Sheet
                  </button>
                </div>
                <Users size={64} className="text-blue-500 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 relative z-10" />
              </div>
            </div>

            {/* 🎯 DRR OFFICIAL BROADCAST STATION (PUBLIC GALLERY UPLOAD) */}
            <div className="bg-gradient-to-br from-rose-600/10 to-purple-600/5 border border-rose-500/30 p-10 rounded-[4rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5"><Camera size={150} className="text-rose-500"/></div>
               <div className="relative z-10">
                 <h2 className="text-2xl font-black flex items-center gap-3 text-rose-500 uppercase italic tracking-tighter leading-none mb-2"><UploadCloud size={28}/> Official Broadcast Station</h2>
                 <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-10">Deploy events directly to the public website gallery (Images Supported)</p>
                 
                 <form onSubmit={handleDrrUpload} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Image Upload Box */}
                    <div className="lg:col-span-4">
                      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-rose-500/30 bg-black/40 group hover:border-rose-500 transition-all cursor-pointer">
                        <input type="file" accept="image/*" onChange={(e) => { setDrrImage(e.target.files[0]); setDrrPreview(URL.createObjectURL(e.target.files[0])); }} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                        {drrPreview ? <img src={drrPreview} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-500/50 group-hover:text-rose-500"><ImageIcon size={40} className="mb-2"/><p className="text-[9px] font-black uppercase tracking-widest">Select Official Photo</p></div>}
                      </div>
                    </div>
                    
                    {/* Details Form */}
                    <div className="lg:col-span-8 space-y-4 flex flex-col justify-center">
                      <input required type="text" placeholder="EVENT HEADLINE" value={drrEvent.title} onChange={e => setDrrEvent({...drrEvent, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-xl font-black uppercase italic outline-none focus:border-rose-500 transition-all text-white" />
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="date" value={drrEvent.date} onChange={e => setDrrEvent({...drrEvent, date: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-rose-500 text-white uppercase tracking-widest" />
                        <input required type="text" placeholder="LOCATION/CITY" value={drrEvent.location} onChange={e => setDrrEvent({...drrEvent, location: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-rose-500 text-white uppercase tracking-widest placeholder:text-neutral-600" />
                      </div>
                      <textarea required rows={4} placeholder="Describe the district initiative..." value={drrEvent.description} onChange={e => setDrrEvent({...drrEvent, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium italic outline-none focus:border-rose-500 text-white resize-none" />
                      <button disabled={isRefreshing} type="submit" className="bg-rose-600 text-white w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                         {isRefreshing ? "Deploying..." : "Broadcast to Public Feed"}
                      </button>
                    </div>
                 </form>
               </div>
            </div>

            {/* ANALYTICS GATEWAY */}
            <Link href="/dashboard/analytics" className="flex items-center justify-between p-10 rounded-[3rem] bg-gradient-to-r from-rose-600/20 to-orange-600/10 border border-rose-500/30 hover:border-rose-500 transition-all group relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/20 blur-[100px] rounded-full group-hover:bg-rose-500/40 duration-700" />
              <div className="flex items-center gap-8 relative z-10">
                <div className="p-5 bg-rose-500/10 rounded-3xl border border-rose-500/20 shadow-inner">
                  <TrendingUp size={40} className="text-rose-500 group-hover:scale-125 transition-transform duration-500" />
                </div>
                <div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-1">District Pulse Analytics</h2>
                  <p className="text-rose-200/50 text-[11px] font-black uppercase tracking-[0.2em]">Live Ranking • Total Service: {stats.hours} Hours • Performance DNA</p>
                </div>
              </div>
              <div className="hidden lg:block bg-white text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] relative z-10 hover:bg-rose-500 hover:text-white transition-all shadow-2xl">Open God Mode</div>
            </Link>

            {/* NOMINATIONS VIEW */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/5 border border-amber-500/20 p-8 rounded-[3.5rem] shadow-xl">
              <h2 className="text-2xl font-black flex items-center gap-3 text-amber-500 uppercase italic tracking-tighter leading-none mb-8"><Trophy size={28}/> Monthly Nominees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nominations.length > 0 ? nominations.map(nom => (
                  <div key={nom.id} className="bg-black/60 border border-white/5 p-6 rounded-[2.5rem] group hover:border-amber-500/30 transition-all shadow-lg relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-14 h-14 bg-amber-500 text-black rounded-2xl flex items-center justify-center font-black text-2xl">{nom.name.charAt(0)}</div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight text-white">{nom.name}</p>
                        <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">{nom.club_name}</p>
                      </div>
                    </div>
                    <div className="border-t border-white/5 pt-4 relative z-10">
                      <p className="text-[11px] text-neutral-400 italic">"{nom.nomination_reason || 'Nominated for exceptional dedication to club service.'}"</p>
                    </div>
                    <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><Star size={60} fill="currentColor" /></div>
                  </div>
                )) : <div className="col-span-full py-10 text-center bg-black/20 rounded-3xl border border-dashed border-white/10 text-neutral-600 font-bold uppercase text-[10px] tracking-widest">No nominations received yet for this cycle.</div>}
              </div>
            </div>

            {/* MASTER DISTRICT ROSTER */}
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[3.5rem] shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <h2 className="text-2xl font-black flex items-center gap-3 text-blue-400 uppercase italic tracking-tighter leading-none"><IdCard size={28}/> District Roster</h2>
                <div className="relative w-full md:w-[450px]">
                  <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input type="text" placeholder="Search Master Roster..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-bold focus:border-blue-500 outline-none text-white shadow-inner transition-all" />
                </div>
              </div>
              <div className="bg-black/20 rounded-[2.5rem] border border-white/5 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                  {filteredMembers.map(m => (
                    <div key={m.id} className="bg-white/[0.03] border border-white/5 p-6 rounded-[2.5rem] hover:border-blue-500/40 transition-all flex flex-col gap-4 group shadow-xl">
                      <div className="flex justify-between items-start">
                        <div className="max-w-[70%]">
                          <p className="font-black text-sm uppercase tracking-tight text-white group-hover:text-blue-400 truncate">{m.name}</p>
                          <p className="text-[9px] text-neutral-500 font-black uppercase mt-1">{m.designation || 'Member'}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                           <span className="text-[10px] font-black text-blue-400 italic bg-blue-500/10 px-2 py-0.5 rounded">{m.volunteer_hours} HR</span>
                           <span className="text-[7px] font-black uppercase text-neutral-700">{m.district_id}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 pt-4 border-t border-white/5 text-[9px] font-bold text-neutral-400 uppercase">
                        <div className="flex items-center gap-2"><Building size={12} className="text-blue-500 opacity-50" /> {m.club_name}</div>
                        <div className="flex items-center gap-2"><Phone size={12} className="text-blue-500 opacity-50" /> {m.phone || 'N/A'}</div>
                        <div className="flex items-center gap-2"><Droplets size={12} className="text-rose-500 opacity-50" /> {m.blood_group}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTIVITY QUEUES & DELETION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Queue */}
              <div className="bg-white/5 p-8 rounded-[3.5rem] border border-white/10 shadow-xl overflow-hidden relative">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase italic text-rose-500 leading-none"><Clock size={24}/> Approval Queue</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {pendingEvents.length === 0 ? <p className="text-center py-20 text-neutral-600 italic text-xs font-bold uppercase tracking-widest opacity-40">All projects reviewed</p> : pendingEvents.map(ev => (
                    <div key={ev.id} className="bg-black/40 p-5 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between border border-white/5 hover:border-rose-500/30 transition-all gap-4">
                      <div className="flex items-center gap-5">
                        <a href={ev.image_url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:text-rose-500 hover:border-rose-500/50 transition-all shadow-2xl">
                          <ExternalLink size={20} />
                        </a>
                        <div><p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{ev.club_name}</p><p className="text-xs font-bold truncate max-w-[150px] uppercase mt-1">{ev.title}</p></div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => handleApprove(ev.id)} className="flex-1 md:flex-none bg-rose-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Approve</button>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="bg-white/5 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Live Activity Control */}
              <div className="bg-white/5 p-8 rounded-[3.5rem] border border-white/10 shadow-xl overflow-hidden">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase italic text-green-400 leading-none"><Eye size={24}/> Live Activity Control</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {approvedEvents.length === 0 ? <p className="col-span-2 text-center py-20 text-neutral-600 italic uppercase font-bold text-[10px] tracking-widest">Feed Empty</p> : approvedEvents.map(ev => (
                    <div key={ev.id} className="bg-black/40 border border-white/5 rounded-[2rem] p-6 group hover:border-green-500/30 transition-all flex flex-col justify-between min-h-[140px] relative overflow-hidden">
                      {ev.club_name === 'RID 3080 OFFICIAL' && <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" style={{backgroundImage: `url(${ev.image_url})`}}></div>}
                      <div className="relative z-10 flex justify-between items-start mb-4">
                        <div>
                          <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${ev.club_name === 'RID 3080 OFFICIAL' ? 'text-rose-500' : 'text-green-400'}`}>{ev.club_name}</p>
                          <p className="text-sm font-bold uppercase text-white leading-tight line-clamp-2">{ev.title}</p>
                        </div>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="text-neutral-600 hover:text-red-500 transition-all ml-2"><Trash2 size={14}/></button>
                      </div>
                      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        {ev.club_name === 'RID 3080 OFFICIAL' ? <p className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1"><Sparkles size={10}/> Public Broadcast</p> : <p className="text-[10px] font-black text-neutral-500 uppercase">{ev.beneficiaries_count} Impacted</p>}
                        <a href={ev.image_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                          <ExternalLink size={12} /> {ev.club_name === 'RID 3080 OFFICIAL' ? 'View Pic' : 'Proof'}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. CLUB INFRASTRUCTURE (ADD CLUBS) */}
            <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[4rem] shadow-xl">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black flex items-center gap-3 text-purple-400 uppercase italic tracking-tighter leading-none"><PlusCircle size={28}/> Infrastructure</h2>
                  <div className="bg-purple-500/20 px-5 py-2 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/30">Active Clubs: {clubs.length}</div>
                </div>
                <form onSubmit={handleAddClub} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14 bg-black/40 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                    <input type="text" placeholder="Club Name" required value={newClub.name} onChange={e => setNewClub({...newClub, name: e.target.value})} className="bg-black border border-white/10 rounded-2xl px-6 py-5 text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                    <input type="text" placeholder="Zone" required value={newClub.zone} onChange={e => setNewClub({...newClub, zone: e.target.value})} className="bg-black border border-white/10 rounded-2xl px-6 py-5 text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                    <input type="email" placeholder="President Email" required value={newClub.president_email} onChange={e => setNewClub({...newClub, president_email: e.target.value})} className="bg-black border border-white/10 rounded-2xl px-6 py-5 text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                    <input type="text" placeholder="President Name" required value={newClub.president} onChange={e => setNewClub({...newClub, president: e.target.value})} className="bg-black border border-white/10 rounded-2xl px-6 py-5 text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                    <input type="text" placeholder="Sponsor Rotary" required value={newClub.sponsor} onChange={e => setNewClub({...newClub, sponsor: e.target.value})} className="bg-black border border-white/10 rounded-2xl px-6 py-5 text-xs font-bold outline-none focus:border-purple-500 transition-all" />
                    <button type="submit" className="bg-white text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-purple-500 hover:text-white transition-all shadow-2xl transform active:scale-95">Deploy Club</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {clubs.map(c => (
                        <div key={c.id} className="bg-black/60 p-7 rounded-[3rem] border border-white/5 flex flex-col group hover:border-purple-500/40 transition-all shadow-lg relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6"><Building size={20} className="text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" /><span className="text-[10px] font-black text-neutral-600 uppercase tracking-tighter">Zone {c.zone}</span></div>
                            <p className="font-black text-[13px] uppercase tracking-tight text-neutral-200 mb-1">{c.name}</p><p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">{c.president}</p>
                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center"><a href={`mailto:${c.president_email}`} className="text-neutral-500 hover:text-white transition-colors"><Mail size={16}/></a><Trash2 size={16} onClick={() => { if(confirm("Remove club from RID 3080?")) supabase.from('clubs').delete().eq('id', c.id).then(fetchAdminData) }} className="text-neutral-800 hover:text-red-500 cursor-pointer transition-colors" /></div>
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
                  <div key={n.id} className="bg-red-500/10 border border-red-500/20 p-8 rounded-[3rem] flex items-center justify-between animate-pulse backdrop-blur-sm shadow-2xl">
                    <div className="flex items-center gap-6"><AlertCircle className="text-red-500" size={32} /><div><p className="text-red-500 font-black uppercase text-[10px] tracking-widest">Administrative Alert</p><p className="text-xl font-bold italic tracking-tight">{n.message}</p></div></div>
                    <button onClick={() => markRead(n.id)} className="bg-white text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all">Dismiss</button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 text-center">
              <Link href="/dashboard/members" className="bg-white/5 border border-white/10 p-14 rounded-[4.5rem] hover:border-blue-500/50 transition-all group shadow-2xl backdrop-blur-sm"><UserIcon size={64} className="text-blue-500 mb-8 mx-auto group-hover:scale-125 transition-transform duration-700" /><h2 className="text-3xl font-black uppercase italic tracking-tighter mb-3">Members</h2><p className="text-neutral-500 text-[11px] font-black uppercase tracking-[0.3em]">Registry Access</p></Link>
              <Link href="/dashboard/events" className="bg-white/5 border border-white/10 p-14 rounded-[4.5rem] hover:border-rose-500/50 transition-all group shadow-2xl backdrop-blur-sm"><CalendarPlus size={64} className="text-rose-500 mb-8 mx-auto group-hover:scale-125 transition-transform duration-700" /><h2 className="text-3xl font-black uppercase italic tracking-tighter mb-3">Events</h2><p className="text-neutral-500 text-[11px] font-black uppercase tracking-[0.3em]">Submit Reports</p></Link>
              <Link href="/dashboard/reports" className="bg-white/5 border border-white/10 p-14 rounded-[4.5rem] hover:border-amber-500/50 transition-all group shadow-2xl backdrop-blur-sm"><Activity size={64} className="text-amber-500 mb-8 mx-auto group-hover:scale-125 transition-transform duration-700" /><h2 className="text-3xl font-black uppercase italic tracking-tighter mb-3">Analytics</h2><p className="text-neutral-500 text-[11px] font-black uppercase tracking-[0.3em]">Audit Hours</p></Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}