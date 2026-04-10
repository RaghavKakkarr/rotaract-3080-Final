'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

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

  // 👇 Ye naya function hai Reset Email bhejnewale ke liye
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
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 uppercase">
      <div className="max-w-md w-full bg-white/[0.02] border border-white/10 p-10 rounded-[3rem]">
        <h1 className="text-4xl font-black italic tracking-tighter mb-8">Login <span className="text-rose-500">Portal</span></h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email Address"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-rose-500 transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-rose-500 transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {/* 👇 Forgot Password Link */}
          <div className="text-right">
            <button 
              type="button"
              onClick={handleForgotPassword}
              className="text-[10px] font-black text-neutral-500 hover:text-rose-500 transition-colors tracking-widest"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-rose-600 font-black py-4 rounded-2xl tracking-[0.2em] hover:bg-rose-500 transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}