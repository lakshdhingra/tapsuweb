import { createClient } from '@supabase/supabase-js';
try { process.loadEnvFile(".env.local"); } catch {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: members, error } = await supabase
    .from("membership_applications")
    .select("id, application_number, full_name, business_name, professional_category, district, submitted_at, status")
    .in("status", ["APPROVED", "SUSPENDED"])
    .order("submitted_at", { ascending: false });

  console.log("Error:", error);
  console.log("Members returned:", members);
}

check();
