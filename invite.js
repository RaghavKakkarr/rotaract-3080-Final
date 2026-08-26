import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Service role key ya URL missing hai!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function sendDemoInvite() {
  const testEmail = "racdelhinexus@gmail.com";
  console.log(`🚀 Sending DEMO Invite Email to: ${testEmail}...\n`);

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(testEmail, {
    redirectTo: 'https://rotaract3080.in/login'
  });

  if (error) {
    console.error(`❌ Demo Failed: ${error.message}`);
  } else {
    console.log(`✅ DEMO SUCCESSFUL! Invite link sent to ${testEmail}`);
    console.log("📥 Apna inbox (aur Spam folder) check karo aur link click karke redirect verify kar lo.");
  }
}

sendDemoInvite();