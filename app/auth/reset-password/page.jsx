'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Email link ke token hash se Session Read/Set karo
    const handleAuthChange = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
      }
    };

    handleAuthChange();

    // 2. Auth State Listener for Password Recovery Flow
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setSessionReady(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("Password updated successfully! Ab login kar lo.");
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-[2.5rem]">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-6">
          New <span className="text-rose-500">Password</span>
        </h1>

        {!sessionReady ? (
          <div className="text-center py-6 text-gray-400 font-medium">
            Verifying secure link token...
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <input
              required
              type="password"
              placeholder="Enter new password"
              value={password}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-rose-500 outline-none text-white"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              disabled={loading}
              className="w-full bg-rose-600 font-black py-4 rounded-2xl uppercase tracking-widest disabled:opacity-50 hover:bg-rose-700 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}