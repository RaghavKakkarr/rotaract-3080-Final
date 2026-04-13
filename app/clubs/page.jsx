'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, Users, Building2, Loader2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ClubFinder() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeZone, setActiveZone] = useState('All');

  const zones = ['All', '1', '2', '3', '4', '5', '6'];

  useEffect(() => { fetchClubs(); }, []);

  async function fetchClubs() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('clubs').select('*').order('name', { ascending: true });
      if (error) throw error;
      setClubs(data || []);
    } catch (err) {
      console.error("Error fetching clubs:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredClubs = clubs.filter(club => {
    const searchLower = search.toLowerCase();
    const matchesSearch = (club.name?.toLowerCase() || '').includes(searchLower) || (club.president?.toLowerCase() || '').includes(searchLower);
    const rawZone = String(club.zone || '').toLowerCase().replace('zone', '').trim();
    const filterZone = String(activeZone).trim().toLowerCase();
    return matchesSearch && (activeZone === 'All' || rawZone === filterZone);
  });

  return (
    // 👇 FIX 1: pt-24 on mobile, pt-32 on desktop
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-24 md:pt-32 pb-20 px-4 md:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER - 👇 FIX 2: mb-8 on mobile, mb-16 on desktop */}
        <header className="mb-8 md:mb-16">
          <p className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px] mb-2 md:mb-4 italic">
            • searchable district directory
          </p>
          {/* 👇 FIX 3: text-4xl on mobile, text-8xl on desktop */}
          <h1 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 md:mb-8 leading-none">
            Club <span className="text-rose-600 dark:text-rose-500 text-not-italic font-sans">Finder</span>
          </h1>
          <p className="text-sm md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl font-medium italic leading-relaxed">
            Browse the clubs with a clean, fast directory.
          </p>
        </header>

        {/* FILTERS & SEARCH - 👇 FIX 4: Sticky top-16 for mobile, smaller padding */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center sticky top-20 md:top-28 z-50 py-3 md:py-6 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md px-1">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Search club..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-white/[0.03] border border-neutral-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-rose-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* 👇 FIX 5: Horizontal scroll for zones on mobile if they overflow */}
          <div className="flex flex-wrap md:flex-nowrap gap-2 justify-start md:justify-center w-full md:w-auto">
            {zones.map(zone => (
              <button 
                key={zone}
                onClick={() => setActiveZone(zone)}
                className={`px-3 md:px-5 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeZone === zone 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                  : 'bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-500'
                }`}
              >
                {zone === 'All' ? 'All' : `Z-${zone}`}
              </button>
            ))}
          </div>
        </div>

        {/* CLUBS GRID */}
        {loading ? (
          <div className="flex justify-center py-20 md:py-40">
            <Loader2 className="animate-spin text-rose-600" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredClubs.map((club) => (
              // 👇 FIX 6: Smaller padding (p-6) and rounded corners (rounded-[2.5rem]) for mobile
              <div key={club.id} className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] group hover:border-rose-400 transition-all duration-500 shadow-sm relative overflow-hidden">
                
                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-10 transition-all">
                    <Building2 size={80} md={120} />
                </div>
                
                <div className="mb-4">
                  <span className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 text-[8px] font-black px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/20 uppercase tracking-widest">
                    Zone {String(club.zone || '').toLowerCase().replace('zone', '').trim()}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-6 text-neutral-900 dark:text-white group-hover:text-rose-600 transition-colors leading-tight">
                  {club.name}
                </h3>
                
                <div className="space-y-4 border-t border-neutral-100 dark:border-white/5 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-rose-600 shrink-0">
                        <Users size={14} />
                    </div>
                    <div>
                        <p className="text-[7px] font-black uppercase text-neutral-400 tracking-widest mb-0.5">President</p>
                        <p className="text-xs font-bold text-neutral-800 dark:text-white">{club.president || 'TBD'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-rose-600 shrink-0">
                        <MapPin size={14} />
                    </div>
                    <div>
                        <p className="text-[7px] font-black uppercase text-neutral-400 tracking-widest mb-0.5">Rotary Sponsor</p>
                        <p className="text-xs font-bold text-neutral-800 dark:text-white">{club.sponsor || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}