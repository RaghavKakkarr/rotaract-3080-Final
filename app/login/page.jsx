'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // 🎯 ADMIN CHECK LOGIC
      // Yahan apna admin email dalo
      const adminEmail = "aapka-asli-email@gmail.com"; 

      if (data.user.email === adminEmail) {
        router.push('/admin'); // Admin ko yahan bhejo
      } else {
        router.push('/dashboard'); // Baki sabko yahan bhejo
      }
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-black italic">CLUB <span className="text-rose-500">LOGIN</span></h1>
          <p className="text-neutral-500 text-sm mt-2 font-medium uppercase tracking-widest">District 3080 Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-neutral-500" size={20} />
            <input type="email" placeholder="Club or Admin Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-rose-500 transition-all" />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-neutral-500" size={20} />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-rose-500 transition-all" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20">
            {loading ? <Loader2 className="animate-spin" /> : 'ENTER PORTAL'}
          </button>
        </form>

        <p className="text-center text-neutral-500 text-sm mt-8 font-medium">
          Issues logging in? <Link href="/" className="text-rose-500 hover:underline">Contact District IT</Link>
        </p>
      </div>
    </main>
  );
}