import { createClient } from '@supabase/supabase-js';
try { process.loadEnvFile(".env.local"); } catch {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  const { data: apps, error: err1 } = await supabase
    .from('membership_applications')
    .select('*')
    .eq('status', 'APPROVED');

  if (err1) {
    console.error(err1);
    return;
  }

  for (const app of apps) {
    const { error: err2 } = await supabase.from('members').insert([{
      application_id: app.id,
      membership_id: app.application_number.replace('APP', 'MEM'), // generate a membership ID
      full_name: app.full_name,
      business_name: app.business_name,
      district: app.district,
      city: app.city,
      phone: app.phone,
      email: app.email,
      category: app.professional_category,
      status: 'ACTIVE'
    }]);
    
    if (err2) {
      // Ignore if it already exists or fails
      console.log('Failed for', app.id, err2.message);
    } else {
      console.log('Migrated', app.full_name);
    }
  }
}

migrate();
