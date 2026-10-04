const { createClient } = require('./node_modules/@supabase/supabase-js/dist/index.cjs');
try { process.loadEnvFile(".env.local"); } catch {}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function clearData() {
  console.log('Clearing data...');

  // 1. Delete audit_logs
  const { error: err1 } = await supabase.from('audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (err1) console.error('Error deleting audit_logs:', err1);
  else console.log('Deleted audit_logs.');

  // 2. Delete members
  const { error: err2 } = await supabase.from('members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (err2) console.error('Error deleting members:', err2);
  else console.log('Deleted members.');

  // 3. Delete membership_applications
  const { error: err3 } = await supabase.from('membership_applications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (err3) console.error('Error deleting membership_applications:', err3);
  else console.log('Deleted membership_applications.');

  // 4. Try to clear storage bucket "application-documents"
  try {
    const { data: list, error: listError } = await supabase.storage.from('application-documents').list();
    if (listError) throw listError;
    
    if (list && list.length > 0) {
      // Note: list might return folders if apps uploaded to specific folders
      for (const item of list) {
        if (item.id === null) {
            // It's a folder
            const { data: subList } = await supabase.storage.from('application-documents').list(item.name);
            if (subList) {
                const pathsToDelete = subList.map(subItem => `${item.name}/${subItem.name}`);
                await supabase.storage.from('application-documents').remove(pathsToDelete);
            }
        }
      }
      // Also just try to delete the top level items/folders themselves (if they were files)
      const topPaths = list.filter(item => item.id !== null).map(item => item.name);
      if (topPaths.length > 0) {
        await supabase.storage.from('application-documents').remove(topPaths);
      }
      console.log('Cleared application-documents bucket.');
    } else {
      console.log('Bucket application-documents is already empty.');
    }
  } catch (err) {
    console.error('Error clearing storage:', err);
  }

  console.log('Data clearing complete.');
}
clearData();