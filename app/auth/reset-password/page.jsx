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
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initSession = async () => {
      // 1. Check PKCE code in query params
      const code = searchParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          setSessionReady(true);
          return;
        }
      }

      // 2. Check hash fragments (#access_token=...)
      if (typeof window !== 'undefined' && window.location.hash) {
        const params = new URLSearchParams(window.location.hash.replace('#', '?'));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            setSessionReady(true);
            return;
          }
        }
      }

      // 3. Fallback check for active session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
      }
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || session) {
        setSessionReady(true);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("✅ Password updated successfully! Ab login kar lo.");
      router.push('/login');
    }
    setLoading(false);
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