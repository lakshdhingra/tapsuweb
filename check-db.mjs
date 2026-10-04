import { createClient } from '@supabase/supabase-js';
try { process.loadEnvFile(".env.local"); } catch {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: apps, error: err1 } = await supabase
    .from('membership_applications')
    .select('id, status');
  console.log('Total applications:', apps?.length);
  console.log('Approved applications:', apps?.filter(a => a.status === 'APPROVED').length);
  console.log('All statuses:', apps?.map(a => a.status));
  
  const { data: members, error: err2 } = await supabase
    .from('members')
    .select('id, application_id, status');
  if (err2) {
    console.log('Members table error:', err2.message);
  } else {
    console.log('Total members:', members?.length);
    console.log('Members data:', members);
  }
}

check();
