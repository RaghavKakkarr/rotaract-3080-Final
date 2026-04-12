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

  useEffect(() => {
    fetchClubs();
  }, []);

  async function fetchClubs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name', { ascending: true });
      
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
    const matchesSearch = 
      (club.name?.toLowerCase() || '').includes(searchLower) || 
      (club.president?.toLowerCase() || '').includes(searchLower);

    const rawZone = String(club.zone || '').toLowerCase();
    const cleanZone = rawZone.replace('zone', '').trim();
    const filterZone = String(activeZone).trim().toLowerCase();
    const matchesZone = activeZone === 'All' || cleanZone === filterZone;

    return matchesSearch && matchesZone;
  });

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-32 pb-20 px-6 font-sans transition-colors duration-300">
      {/* 🎯 Container matched to max-w-6xl for consistency */}
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-16">
          <p className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic">
            • searchable district directory
          </p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
            Club <span className="text-rose-600 dark:text-rose-500 text-not-italic font-sans">Finder</span>
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl font-medium italic">
            "Browse the clubs with a clean, fast directory. Every card is sized to stay readable and compact."
          </p>
        </header>

        {/* FILTERS & SEARCH - Added horizontal padding to prevent edge sticking */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center sticky top-28 z-50 py-6 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md transition-colors duration-300 px-2">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={18} />
            <input 
              type="text" 
              placeholder="Search club or president..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-white/[0.03] border border-neutral-300 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:border-rose-500 outline-none transition-all shadow-sm text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {zones.map(zone => (
              <button 
                key={zone}
                onClick={() => setActiveZone(zone)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeZone === zone 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                  : 'bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-rose-600'
                }`}
              >
                {zone === 'All' ? 'All' : `Zone ${zone}`}
              </button>
            ))}
          </div>
        </div>

        {/* CLUBS GRID */}
        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-rose-600 dark:text-rose-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => {
                const displayZone = String(club.zone || '').toLowerCase().replace('zone', '').trim();
                
                return (
                  <div key={club.id} className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-10 rounded-[3.5rem] group hover:border-rose-400 dark:hover:border-rose-500/50 transition-all duration-500 shadow-sm dark:shadow-none relative overflow-hidden">
                    
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-10 transition-all duration-700">
                        <Building2 size={120} />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6">
                      <span className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 text-[9px] font-black px-4 py-1.5 rounded-full border border-rose-200 dark:border-rose-500/20 uppercase tracking-widest">
                        Zone {displayZone}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-neutral-900 dark:text-white group-hover:text-rose-600 transition-colors leading-tight min-h-[3rem]">
                      {club.name}
                    </h3>
                    
                    <div className="space-y-6 border-t border-neutral-100 dark:border-white/5 pt-8">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-rose-600 dark:text-rose-500 shrink-0">
                            <Users size={16} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mb-1">President</p>
                            <p className="text-sm font-bold text-neutral-800 dark:text-white">{club.president || 'TBD'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-rose-600 dark:text-rose-500 shrink-0">
                            <MapPin size={16} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mb-1">Rotary Sponsor</p>
                            <p className="text-sm font-bold text-neutral-800 dark:text-white">{club.sponsor || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
        )}
      </div>
    </main>
  );
}