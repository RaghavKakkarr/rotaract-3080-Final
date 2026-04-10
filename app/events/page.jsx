'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Globe, Sparkles, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PublicEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovedEvents() {
      // Fetching all approved events (Both DRR & Clubs)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false }); 
      
      if (!error && data) setEvents(data);
      setLoading(false);
    }
    fetchApprovedEvents();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-20 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* 🌌 Background FX */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-600/10 blur-[150px] rounded-full -z-10 pointer-events-none" />

      {/* 🚀 NAVBAR */}
      <nav className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tighter uppercase flex items-center gap-2 hover:text-rose-500 transition-colors">
            <Globe className="text-rose-500" /> RID 3080
          </Link>
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-20">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles size={12} /> Live Action Feed
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-6">
            District <span className="text-rose-500 text-not-italic">Broadcasts</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base font-medium italic">
            Real-time highlights of major initiatives, official visits, and large-scale community service projects driven by Rotaract Clubs across RID 3080.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20 text-rose-500">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Feeds...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center border border-dashed border-white/10 p-20 rounded-[3rem] max-w-3xl mx-auto bg-white/[0.02]">
            <Calendar size={48} className="mx-auto text-neutral-600 mb-6" />
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Feed Empty</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">No approved events available right now.</p>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => {
            const isOfficial = event.club_name === 'RID 3080 OFFICIAL';

            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border border-white/10 rounded-[3rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-2xl flex flex-col relative ${isOfficial ? 'bg-black aspect-[4/5]' : 'bg-white/[0.03] hover:border-rose-500/30'}`}
              >
                {/* 🎯 SMART RENDER: DRR Photo vs Club Link */}
                {isOfficial ? (
                  // DRR OFFICIAL EVENT (Renders Full Image Background)
                  <>
                    <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent opacity-90" />
                    <div className="relative z-10 flex flex-col justify-end h-full p-8">
                      <span className="inline-flex w-max items-center gap-2 px-3 py-1.5 bg-rose-500 border border-rose-400 rounded-full text-[8px] font-black uppercase tracking-widest text-white mb-4 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                        <Sparkles size={10} /> Official Broadcast
                      </span>
                      <h3 className="text-2xl font-black uppercase italic leading-tight mb-3 text-white line-clamp-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-[9px] font-black text-rose-300 uppercase tracking-widest mt-2">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  // CLUB EVENT (Renders Text Card with Proof Link Button)
                  <div className="p-8 flex flex-col h-full min-h-[350px]">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Building size={12} className="text-rose-500" /> {event.club_name}
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-black uppercase italic tracking-tight mb-4 group-hover:text-rose-400 transition-colors line-clamp-2">{event.title}</h2>
                    <p className="text-neutral-400 text-sm italic font-medium line-clamp-3 leading-relaxed mb-6 flex-1">
                      "{event.description}"
                    </p>
                    
                    <div className="border-t border-white/5 pt-6 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 mb-1">Date</span>
                        <span className="text-xs font-bold uppercase text-white">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <a 
                        href={event.image_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 bg-rose-600 hover:bg-white hover:text-black text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg"
                      >
                        <ExternalLink size={14} /> Evidence
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </main>
  );
}