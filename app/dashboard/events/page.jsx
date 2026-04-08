'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, MapPin, Calendar, ArrowLeft, Loader2, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EventUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    club_name: ''
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = '';
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `event-pics/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);
        
        image_url = publicUrl;
      }

      const { error } = await supabase.from('events').insert([
        {
          ...formData,
          image_url,
          is_approved: true,
          created_at: new Date(),
        },
      ]);

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6 relative overflow-hidden">
      {/* 🌌 Crazy Background Graphics */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link href="/dashboard" className="group inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-all mb-12 font-black uppercase text-[10px] tracking-[0.3em]">
          <div className="p-2 rounded-full border border-white/5 group-hover:border-rose-500/50 group-hover:bg-rose-500/10 transition-all">
            <ArrowLeft size={14} />
          </div>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Live Reporting
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Capture <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Impact</span>
          </h1>
          <p className="text-neutral-500 text-xs uppercase tracking-[0.4em] font-bold">Upload Event Photos & Details</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Image Upload (40%) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/[0.02] group transition-all hover:border-rose-500/40">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-rose-500/20 group-hover:text-rose-500 transition-all">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">Drop Event Photo</p>
                  <p className="text-[10px] text-neutral-600 mt-2 tracking-tighter font-medium italic">High quality .jpg or .png</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Form Data (60%) */}
          <div className="lg:col-span-7 space-y-6 bg-white/[0.01] backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[3rem]">
            
            <div className="space-y-6">
              <div className="relative">
                <input 
                  required
                  type="text" 
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:border-rose-500 outline-none transition-all text-2xl font-black italic uppercase tracking-tighter placeholder:text-neutral-800"
                  placeholder="EVENT TITLE"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5 focus-within:border-rose-500/50 transition-all">
                  <Calendar size={18} className="text-rose-500" />
                  <input required type="date" className="bg-transparent w-full outline-none text-[10px] font-black uppercase tracking-widest text-white cursor-pointer" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5 focus-within:border-rose-500/50 transition-all">
                  <MapPin size={18} className="text-rose-500" />
                  <input required type="text" placeholder="LOCATION" className="bg-transparent w-full outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-neutral-700" onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>

              <textarea 
                required
                rows={4}
                placeholder="DESCRIBE THE IMPACT..."
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 focus:border-rose-500 outline-none transition-all text-sm font-medium leading-relaxed italic placeholder:text-neutral-700"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <button 
                disabled={loading}
                type="submit" 
                className="group relative w-full h-16 overflow-hidden rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white">
                  {loading ? <Loader2 className="animate-spin" /> : <><Zap size={14} /> Finish & Publish</>}
                </span>
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}