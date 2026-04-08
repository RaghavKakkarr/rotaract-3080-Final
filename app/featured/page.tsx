'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Loader2, Image as ImageIcon } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function FeaturedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_approved', true) 
        .order('project_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <p className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic tracking-widest">• district showcase</p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
            Featured <span className="text-rose-500 text-not-italic font-sans">Events</span>
          </h1>
          <p className="text-neutral-500 max-w-2xl font-medium italic">Explore the latest service projects and fellowship meets approved by the district council.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-rose-500" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Retrieving Gallery...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-[4rem]">
            <ImageIcon size={48} className="mx-auto text-neutral-800 mb-6" />
            <p className="text-neutral-600 font-black uppercase italic tracking-widest text-xs">No approved events found in the public gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((ev) => (
              <div key={ev.id} className="group bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden hover:border-rose-500/50 transition-all duration-700">
                <div className="aspect-video relative overflow-hidden bg-neutral-900">
                  <img 
                    src={ev.image_url} 
                    alt={ev.title} 
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-rose-500 text-white text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-2xl">
                      {ev.club_name}
                    </span>
                  </div>
                </div>
                
                <div className="p-10">
                  <div className="flex items-center gap-4 text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-rose-500"/> {ev.project_date}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-rose-500 transition-colors leading-tight mb-4">
                    {ev.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed italic line-clamp-3 font-sans">
                    {ev.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}