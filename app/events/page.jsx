'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PublicEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovedEvents() {
      // Sirf 'is_approved: true' wale events fetch karenge
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_approved', true)
        .order('date', { ascending: false }); // Naye events upar dikhenge
      
      if (!error && data) setEvents(data);
      setLoading(false);
    }
    fetchApprovedEvents();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            District <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">Events</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Discover the impactful projects, fellowships, and initiatives driven by Rotaract Clubs across RID 3080.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center bg-white/5 border border-white/10 p-12 rounded-3xl max-w-2xl mx-auto">
            <Calendar size={48} className="mx-auto text-neutral-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Upcoming Events</h3>
            <p className="text-neutral-400">Stay tuned! Our clubs are planning something amazing.</p>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden group hover:border-rose-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(225,29,72,0.2)]"
            >
              {/* Event Image */}
              {event.image_url ? (
                <div className="w-full h-56 relative overflow-hidden bg-neutral-900">
                  <img 
                    src={event.image_url} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full h-56 bg-neutral-900 flex items-center justify-center">
                  <Calendar size={40} className="text-neutral-700" />
                </div>
              )}

              {/* Event Details */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Users size={14} /> {event.club_name}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2 group-hover:text-rose-400 transition-colors">{event.title}</h2>
                <p className="text-rose-500 text-sm font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={16} /> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-neutral-400 text-sm line-clamp-3 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}