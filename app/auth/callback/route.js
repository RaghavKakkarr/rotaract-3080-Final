import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Simply redirect the code/hash straight to reset-password page
  if (code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password?code=${code}`);
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`);
}