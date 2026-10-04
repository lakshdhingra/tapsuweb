const { createClient } = require('./node_modules/@supabase/supabase-js/dist/index.cjs');
try { process.loadEnvFile(".env.local"); } catch {}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function check() {
  const tables = ['members', 'membership_applications', 'audit_logs', 'contact_messages', 'news_articles', 'announcements', 'resources', 'media_albums'];
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    console.log(`${table}: ${count} rows`);
  }
}
check();