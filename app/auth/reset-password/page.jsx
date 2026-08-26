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
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Page load hone par URL se tokens read karke session explicitly set karo
    const initSession = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    };

    initSession();
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🚀 FIX: Submit karne se pehle ensure karo ki token URL se active session me binded hai
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          throw new Error("Session expire ho gaya hai. Kripya naya reset link mangwayen.");
        }
      }

      // Naya password update karo
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("✅ Password successfully updated! Ab login kar lo.");
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
        {loading ? "Updating..." : "Update Password"}
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