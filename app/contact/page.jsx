'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Send, Mail, Globe, MessageSquare, Loader2 } from 'lucide-react';

// Supabase Initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.role,
          message: formData.message,
          created_at: new Date()
        }
      ]);

      if (error) throw error;

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: "16a6d627-af6b-41a6-918b-760df2148d08", 
          subject: `New Portal Alert from: ${formData.name}`,
          name: formData.name,
          email: formData.email,
          "Club/Role": formData.role,
          message: formData.message,
        })
      });
      
      setStatus('Message sent successfully! 🚀');
      setFormData({ name: '', email: '', role: '', message: '' }); 
      setTimeout(() => setStatus(''), 4000);
    } catch (error) {
      setStatus('Failed to send: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 👇 PADDING FIX: Mobile pt-24 (Navbar overlap fix), Desktop pt-32
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pt-24 md:pt-32 pb-20 px-4 md:px-6 font-sans transition-colors duration-300">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HERO SECTION */}
        <header className="mb-12 md:mb-24">
          <p className="text-rose-600 dark:text-rose-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] mb-4 italic tracking-widest leading-none">
            • talk to the district
          </p>
          <h1 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-none">
            Contact <span className="text-rose-600 dark:text-rose-500 text-not-italic font-sans">3080</span>
          </h1>
          <p className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed font-medium italic">
            "Keep communication clean, useful, and easy to act on. Structured so clubs and visitors can quickly find the right path."
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* CONTACT FORM - Mobile padding optimized (p-6 to p-12) */}
          <div className="lg:col-span-7 bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm dark:shadow-none transition-all">
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3 text-neutral-900 dark:text-white">
              <MessageSquare className="text-rose-600 dark:text-rose-500" size={24} /> Submit<span className="text-rose-600 dark:text-rose-500 text-not-italic">Inquiry</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest italic">Full Name</label>
                  <input 
                    type="text" required placeholder="Your Name" value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm focus:border-rose-500 outline-none transition-all text-neutral-900 dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest italic">Email Address</label>
                  <input 
                    type="email" required placeholder="name@email.com" value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm focus:border-rose-500 outline-none transition-all text-neutral-900 dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest italic">Club / District Role</label>
                <input 
                  type="text" placeholder="e.g. RAC Chandigarh / Visitor" required value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm focus:border-rose-500 outline-none transition-all text-neutral-900 dark:text-white" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest italic">Message</label>
                <textarea 
                  rows="4" required placeholder="How can the district help you?" value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm focus:border-rose-500 outline-none resize-none transition-all text-neutral-900 dark:text-white"
                ></textarea>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-black py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 shadow-lg"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Send Message</>}
              </button>

              {status && (
                <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center mt-4 ${status.includes('Failed') ? 'text-red-600' : 'text-green-600 animate-pulse'}`}>
                  {status}
                </p>
              )}
            </form>
          </div>

          {/* OFFICIAL INFO BLOCKS */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] group hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-all shadow-sm">
              <Mail className="text-rose-600 dark:text-rose-500 mb-4 md:mb-6" size={28} md={32} />
              <p className="text-neutral-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 italic leading-none">Official Mail</p>
              <h3 className="text-xl md:text-2xl font-black italic text-neutral-900 dark:text-white mb-2 break-words">drr@rotaract3080.org</h3>
              <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest">RID 3080 • India</p>
            </div>

            <div className="bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] group hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-all shadow-sm">
              <Globe className="text-rose-600 dark:text-rose-500 mb-4 md:mb-6" size={28} md={32} />
              <p className="text-neutral-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 italic leading-none">Global Mission</p>
              <h3 className="text-xl md:text-2xl font-black italic text-neutral-900 dark:text-white mb-3 md:mb-4">Rotary International</h3>
              <a href="https://www.rotary.org" target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase text-rose-600 dark:text-rose-500 tracking-[0.2em] hover:underline">Visit rotary.org →</a>
            </div>

            <div className="p-8 md:p-10 border border-dashed border-neutral-300 dark:border-white/10 rounded-[2rem] md:rounded-[3rem] text-center">
              <p className="text-neutral-400 dark:text-neutral-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic leading-relaxed">
                "Connecting clubs, leaders, and visitors through a singular district movement."
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}