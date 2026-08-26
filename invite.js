import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const REDIRECT_URL = 'https://rotaract3080.in/auth/reset-password';

// 1. EXACT 22 REMAINING UNINVITED PRESIDENTS
const remainingUninvited = [
  { name: "D.A.V. (C) Dental, Yamuna Nagar", email: "kashishydv30@gmail.com" },
  { name: "DAV College for Girls Yamuna Nagar", email: "arshk.1820@gmail.com" },
  { name: "D.A.V Institute of Physiotherapy & Rehabilitation", email: "thakur.vishu0@gmail.com" },
  { name: "Guru Nanak Girls College", email: "rehatdeep0@gmail.com" },
  { name: "GNKITM", email: "dhimanrahul468@gmail.com" },
  { name: "Maharaja Agrasen College (Jagadhri North)", email: "ronteysimi323@gmail.com" },
  { name: "Yamunanagar", email: "nikhild025@gmail.com" },
  { name: "Yamuna Nagar Riviera", email: "nishakashyap2130@gmail.com" },
  { name: "Alaknanda Valley", email: "amanrajkol2094@gmail.com" },
  { name: "Avyanna, Roorkee", email: "vanshbhardwaj98.rke@gmail.com" },
  { name: "Bajrang Institute Rishikesh", email: "anujdhyani69917@gmail.com" },
  { name: "B S Negi Mahila Pravidhik Prashikshan Sansthan", email: "bishtshivani597@gmail.com" },
  { name: "Doon Ganga Chidderwala", email: "tusharbendwal12@gmail.com" },
  { name: "Himachal Institute of Dental Sciences (Paonta Sahib)", email: "ivjyotlife12@gmail.com" },
  { name: "IMS Unison University Dehradun", email: "saaransh0030@gmail.com" },
  { name: "Indian Institute of Management – Sirmaur", email: "caitlinshivram23.11@gmail.com" },
  { name: "Law College Dehradun", email: "kritikagoswami66@gmail.com" },
  { name: "Rishikesh Queens", email: "anushkamaratha@gmail.com" },
  { name: "Rishikesh Royal", email: "rachitrajput456@gmail.com" },
  { name: "Rishikesh Young Central", email: "rachitbisht547@gmail.com" },
  { name: "Roorkee Waves", email: "JGN.DUA@GMAIL.COM" },
  { name: "Sardar Bhagwan Singh University", email: "nc133970@gmail.com" }
];

// 2. EXACT 28 REMAINING FIRST BATCH PRESIDENTS (NEED UPDATED RESET LINK)
const remainingFirstBatch = [
  "ashthakur69906@gmail.com",
  "harshitabaliyan07@gmail.com",
  "chandelu50@gmail.com",
  "samihaba23026@hpnlu.ac.in",
  "anshul9624@gmail.com",
  "231030142@juitsolan.in",
  "priyanshibhatia136@gamil.com",
  "rtrroodranshmehta@gmail.com",
  "presidentrcch26@gmail.com",
  "tiwarivedica12@gmail.com",
  "asmit07malhotra@gmail.com",
  "mongaayushman@gmail.com",
  "ray731300@gmail.com",
  "Tamanpreetkaur7965@gmail.com",
  "yash.sa082005@gmail.com",
  "zyukti4@gmail.com",
  "bhavikathakur0506@gmail.com",
  "rishitbansal007@gmail.com",
  "Amardeepbumra@gmail.com",
  "kj2438141@gmail.com",
  "kaltasonakshi@gmail.com",
  "rohanarula2004@gmail.com",
  "mehsempurivinayak@gmail.com",
  "anshulmittal108@gmail.com",
  "ArshitBhagi@gmail.com",
  "asharma9_be25@thapar.edu",
  "ysandeepyadav711@gmail.com",
  "pawni26kaur@gmail.com",
  "shubhams1994@gmail.com"
];

async function processAll() {
  console.log("==========================================");
  console.log("🚀 PART 1: INVITING 22 REMAINING UNINVITED PRESIDENTS");
  console.log("==========================================\n");

  for (const club of remainingUninvited) {
    const { error } = await supabase.auth.admin.inviteUserByEmail(club.email, {
      redirectTo: REDIRECT_URL
    });

    if (error) {
      console.log(`❌ Failed Invite: ${club.email} -> ${error.message}`);
    } else {
      console.log(`✅ Invited -> ${club.email} (${club.name})`);
    }
  }

  console.log("\n==========================================");
  console.log("🚀 PART 2: SENDING RESET LINKS TO 28 REMAINING FIRST BATCH");
  console.log("==========================================\n");

  for (const email of remainingFirstBatch) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: REDIRECT_URL
    });

    if (error) {
      console.log(`❌ Failed Reset Link: ${email} -> ${error.message}`);
    } else {
      console.log(`✅ Updated Reset Link Sent -> ${email}`);
    }
  }

  console.log("\n🎉 ALL DISTRICT PRESIDENTS INVITED AND UPDATED SUCCESSFULLY!");
}

processAll();