'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Building, Globe, Sparkles, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PublicEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovedEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false }); 
      
      if (!error && data) setEvents(data);
      setEvents(data || []);
      setLoading(false);
    }
    fetchApprovedEvents();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-32 pb-20 px-6 font-sans transition-colors duration-300">
      
      {/* 🎯 Container matched to max-w-6xl for consistency */}
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HERO SECTION (About Page Style) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-24"
        >
          <p className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic tracking-widest">
            • live district action feed
          </p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
            District <span className="text-rose-600 dark:text-rose-500 text-not-italic font-sans">Broadcasts</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed font-medium italic">
            "Real-time highlights of major initiatives, official visits, and community service projects driven by Rotaract RID 3080."
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-40 text-rose-600 dark:text-rose-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Feeds...</p>
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="text-center border border-dashed border-neutral-300 dark:border-white/10 p-20 rounded-[4rem] bg-white dark:bg-white/[0.02]">
            <Calendar size={48} className="mx-auto text-neutral-300 dark:text-neutral-800 mb-6" />
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2 text-neutral-900 dark:text-white">Feed Empty</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">No approved events available right now.</p>
          </div>
        ) : (
          /* Events Grid (Matched gap with other pages) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => {
              const isOfficial = event.club_name === 'RID 3080 OFFICIAL';

              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 rounded-[3.5rem] overflow-hidden group hover:border-rose-400 dark:hover:border-rose-500/50 transition-all duration-500 shadow-sm dark:shadow-none flex flex-col h-full"
                >
                  {/* Image Section */}
                  <div className="aspect-video relative overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <img 
                      src={event.image_url} 
                      alt={event.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                    />
                    <div className="absolute top-6 left-6 z-10">
                      <span className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl border border-white/10 flex items-center gap-2 ${isOfficial ? 'bg-rose-600 text-white' : 'bg-neutral-900 text-white'}`}>
                        {isOfficial && <Sparkles size={10} />}
                        {isOfficial ? 'Official Broadcast' : event.club_name}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-10 flex flex-col flex-1 text-left">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight mb-4 text-neutral-900 dark:text-white group-hover:text-rose-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-500 text-xs italic font-medium leading-relaxed mb-8 flex-1 line-clamp-3">
                      "{event.description}"
                    </p>
                    
                    <div className="border-t border-neutral-100 dark:border-white/5 pt-8 mt-auto flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-[8px] font-black text-rose-600 uppercase tracking-widest italic">
                          <MapPin size={10} /> {event.location || 'RID 3080'}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-800 dark:text-white uppercase tracking-tighter">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      {!isOfficial && (
                        <a 
                          href={event.image_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 bg-neutral-100 dark:bg-white/5 hover:bg-rose-600 dark:hover:bg-rose-600 text-neutral-900 dark:text-white hover:text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          <ExternalLink size={14} /> Evidence
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}