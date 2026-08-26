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
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        // 1. Mobile Browsers ke Query Params (?code=...)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && isMounted) {
            setSessionReady(true);
            return;
          }
        }

        // 2. Hash Fragments (#access_token=...)
        const hash = window.location.hash;
        if (hash) {
          const params = new URLSearchParams(hash.replace('#', '?'));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error && isMounted) {
              setSessionReady(true);
              return;
            }
          }
        }

        // 3. Existing Session Check
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          setSessionReady(true);
          return;
        }

        // 4. Mobile delay fallback: Timeout after 6 seconds if token couldn't be parsed
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession && isMounted) {
            setSessionReady(true);
          } else if (isMounted && !sessionReady) {
            setErrorMsg("Security link expire ho gaya hai ya mobile browser mein issue aaya. Kripya Chrome/Safari mein link directly khol kar dekhein.");
          }
        }, 6000);

      } catch (err) {
        if (isMounted) setErrorMsg("Link verify karne mein dikkat aayi.");
      }
    };

    initSession();

    // 5. Auth State Listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || session) && isMounted) {
        setSessionReady(true);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
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
          <div className="text-center py-6 space-y-4">
            {errorMsg ? (
              <div className="space-y-3">
                <p className="text-sm text-rose-400 font-medium">{errorMsg}</p>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="text-xs bg-white/10 px-4 py-2 rounded-xl text-white font-bold"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <div className="text-gray-400 font-medium text-sm">
                Verifying secure link token...
              </div>
            )}
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