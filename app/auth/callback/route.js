import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Exchange code on server
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.session) {
      // Direct session parameters query params mein attach karke reset page par bhej do
      const response = NextResponse.redirect(`${requestUrl.origin}/auth/reset-password?access_token=${data.session.access_token}&refresh_token=${data.session.refresh_token}`);
      return response;
    }
  }

  // Fallback if code fails
  return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`);
}