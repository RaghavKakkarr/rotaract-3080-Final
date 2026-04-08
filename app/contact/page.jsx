'use client';

import { useState } from 'react';
import { Send, Mail, MapPin, Globe, MessageSquare, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simple simulation for now
    setTimeout(() => {
      setLoading(false);
      setStatus('Message sent successfully! 🚀');
      e.target.reset();
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-20 text-center md:text-left">
          <p className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic tracking-widest">• talk to the district</p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none italic">Contact <span className="text-rose-500 text-not-italic font-sans">3080</span></h1>
          <p className="text-neutral-500 max-w-2xl font-medium italic">"Keep the contact page clean, useful, and easy to act on. Structured so clubs and visitors can quickly find the right path for district communication."</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* CONTACT FORM */}
          <div className="bg-white/[0.03] border border-white/10 p-10 md:p-16 rounded-[4rem] shadow-2xl">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
              <MessageSquare className="text-rose-500" /> Send a <span className="text-rose-500">Message</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest">Full Name</label>
                  <input type="text" required placeholder="Your Name" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-rose-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest">Email Address</label>
                  <input type="email" required placeholder="yourname@email.com" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-rose-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest">Club / District Role</label>
                <input type="text" placeholder="e.g. RAC Chandigarh / Visitor" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-rose-500 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest">Message</label>
                <textarea rows="5" required placeholder="How can the district help you?" className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-rose-500 outline-none resize-none transition-all"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-rose-500 hover:text-white transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Send Message</>}
              </button>

              {status && (
                <p className="text-green-400 text-[10px] font-black uppercase tracking-widest text-center animate-bounce">{status}</p>
              )}
            </form>
          </div>

          {/* OFFICIAL INFO BLOCKS */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] group hover:border-blue-500/30 transition-all">
              <Mail className="text-blue-500 mb-6" size={32} />
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 italic tracking-widest italic tracking-widest italic tracking-widest tracking-widest tracking-widest">Official Info</h3>
              <p className="text-neutral-500 text-sm leading-relaxed font-sans mb-6 italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest">"District portal, clubs, council, and service information."</p>
              <div className="space-y-2 font-sans italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest">
                <p className="text-sm font-bold tracking-tight">drr@rotaract3080.org</p>
                <p className="text-sm font-bold tracking-tight text-neutral-400 uppercase tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest text-[10px] tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest tracking-widest tracking-widest">RID 3080 • India</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] group hover:border-amber-500/30 transition-all">
              <Globe className="text-amber-500 mb-6" size={32} />
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest">Rotary International</h3>
              <p className="text-neutral-500 text-sm leading-relaxed font-sans mb-6 italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest">"Global mission, causes, and foundation-led service."</p>
              <a href="https://www.rotary.org" target="_blank" className="text-[10px] font-black uppercase text-amber-500 tracking-widest hover:underline italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest">Visit rotary.org →</a>
            </div>

            <div className="p-10 border border-dashed border-white/10 rounded-[3rem] text-center">
              <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest">Collaboration</p>
              <p className="text-neutral-400 text-xs italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest italic tracking-widest">"Use this page to connect clubs, leaders, and visitors quickly."</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}