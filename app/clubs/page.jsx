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

  // 🎯 SMART FILTERING & CLEANING LOGIC
  const filteredClubs = clubs.filter(club => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      (club.name?.toLowerCase() || '').includes(searchLower) || 
      (club.president?.toLowerCase() || '').includes(searchLower);

    // CLEANING LOGIC: "Zone 2" ko "2" mein convert karna
    const rawZone = String(club.zone || '').toLowerCase();
    const cleanZone = rawZone.replace('zone', '').trim(); // "Zone 2" -> "2"
    
    const filterZone = String(activeZone).trim().toLowerCase();
    const matchesZone = activeZone === 'All' || cleanZone === filterZone;

    return matchesSearch && matchesZone;
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-16">
          <p className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic tracking-widest">• searchable district directory</p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">Club <span className="text-rose-500 text-not-italic font-sans">Finder</span></h1>
          <p className="text-neutral-500 max-w-2xl font-medium italic italic">"Browse the clubs with a clean, fast directory. Every card is sized to stay readable and compact."</p>
        </header>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center sticky top-28 z-50 py-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text" 
              placeholder="Search club or president..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:border-rose-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {zones.map(zone => (
              <button 
                key={zone}
                onClick={() => setActiveZone(zone)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeZone === zone 
                  ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                  : 'bg-white/5 text-neutral-500 hover:text-white hover:bg-white/10'
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
            <Loader2 className="animate-spin text-rose-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club) => {
                // Display Cleaning: Agar data "Zone 2" hai toh use clean karke dikhana
                const displayZone = String(club.zone || '').toLowerCase().replace('zone', '').trim();
                
                return (
                  <div key={club.id} className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] group hover:border-rose-500/50 transition-all duration-500 hover:-translate-y-1 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-all duration-700">
                        <Building2 size={120} />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6">
                      <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-rose-500/20 uppercase tracking-tighter">
                        Zone {displayZone}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 group-hover:text-rose-500 transition-colors leading-tight min-h-[3rem]">{club.name}</h3>
                    
                    <div className="space-y-6 border-t border-white/5 pt-8 font-sans">
                      <div className="flex items-start gap-4 font-sans">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-rose-500 shrink-0 font-sans">
                            <Users size={16} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase text-neutral-500 tracking-widest mb-1 font-sans">President</p>
                            <p className="text-sm font-bold tracking-tight font-sans">{club.president || 'TBD'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 font-sans">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-rose-500 shrink-0 font-sans">
                            <MapPin size={16} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase text-neutral-500 tracking-widest mb-1 font-sans">Rotary Sponsor</p>
                            <p className="text-sm font-bold tracking-tight font-sans">{club.sponsor || 'N/A'}</p>
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