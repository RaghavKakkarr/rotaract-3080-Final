import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function sendResetLink() {
  const testEmail = "racdelhinexus@gmail.com";
  console.log(`🚀 Sending Password Reset Link to existing user: ${testEmail}...\n`);

  // 🚀 FIX: Directly redirect to /auth/reset-password
  const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
    redirectTo: 'https://rotaract3080.in/auth/reset-password'
  });

  if (error) {
    console.error(`❌ Failed: ${error.message}`);
  } else {
    console.log(`✅ SUCCESS! Reset link sent to ${testEmail}`);
  }
}

sendResetLink();