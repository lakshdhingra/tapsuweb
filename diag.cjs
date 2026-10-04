const { createClient } = require('./node_modules/@supabase/supabase-js/dist/index.cjs');
try { process.loadEnvFile(".env.local"); } catch {}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function run() {
  const { data: members, error } = await supabase
    .from('members')
    .select('id, application_id, membership_id, full_name');
  if (error) console.log('ERROR:', JSON.stringify(error));
  else { 
    console.log(JSON.stringify(members, null, 2)); 
  }
}
run().catch(console.error);