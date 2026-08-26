'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Automatic token detection on load
  useEffect(() => {
    const establishSession = async () => {
      try {
        // 1. Check PKCE code in query (?code=...)
        const code = searchParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) return;
        }

        // 2. Check Hash Fragment (#access_token=...)
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        }
      } catch (err) {
        console.error("Session init issue:", err);
      }
    };

    establishSession();
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    try {
      // 🚀 CRITICAL FIX: Direct session verification right before update
      const code = searchParams.get('code');
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      } else if (typeof window !== 'undefined' && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      }

      // Password update call
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        if (error.message.includes('session') || error.message.includes('Auth session missing')) {
          alert("Link expire ho chuka hai! Kripya Login page par 'Forgot Password' daba kar Naya Link mangwayen.");
        } else {
          alert(`Error: ${error.message}`);
        }
      } else {
        alert("✅ Password successfully update ho gaya hai! Ab login kar lo.");
        router.push('/login');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-6">
      <input
        required
        type="password"
        placeholder="Enter new password"
        value={password}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-rose-500 outline-none text-white text-sm"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        disabled={loading}
        className="w-full bg-rose-600 font-black py-4 rounded-2xl uppercase tracking-widest disabled:opacity-50 hover:bg-rose-700 transition text-xs"
      >
        {loading ? "Updating Password..." : "Update Password"}
      </button>
    </form>
  );
}

export default function ResetPassword() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-[2.5rem]">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-6">
          New <span className="text-rose-500">Password</span>
        </h1>
        <Suspense fallback={<div className="text-center py-6 text-gray-400">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}