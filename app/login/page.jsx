'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push('/dashboard');
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Pehle apni Email ID likho bhai!");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) alert(error.message);
    else alert("Reset link aapki email par bhej diya gaya hai! Check karo.");
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex items-center justify-center px-6 transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-md w-full bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 p-10 md:p-12 rounded-[3.5rem] shadow-xl dark:shadow-2xl backdrop-blur-md">
        <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-500 border border-rose-100 dark:border-rose-500/20">
                <ShieldCheck size={32} />
            </div>
        </div>

        <h1 className="text-4xl font-black italic tracking-tighter mb-8 text-center uppercase">
            Login <span className="text-rose-600 dark:text-rose-500">Portal</span>
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest">Official Email</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                required
                type="email"
                placeholder="president@clubname.com"
                className="w-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-rose-500 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-700"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-neutral-500 ml-2 tracking-widest">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-rose-500 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-700"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="text-right">
            <button 
              type="button"
              onClick={handleForgotPassword}
              className="text-[10px] font-black text-neutral-400 hover:text-rose-600 dark:hover:text-rose-500 transition-colors tracking-widest uppercase"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-neutral-900 dark:bg-rose-600 text-white font-black py-5 rounded-2xl tracking-[0.2em] uppercase text-xs hover:bg-rose-600 dark:hover:bg-rose-500 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Enter Dashboard"}
          </button>
        </form>

        <p className="mt-8 text-center text-neutral-400 text-[9px] font-bold uppercase tracking-widest">
            Authorized Personnel Only • RID 3080
        </p>
      </div>
    </main>
  );
}