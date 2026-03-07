// Check if schema deployed successfully
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkSchema() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  const tables = [
    'users',
    'subscriptions', 
    'presets',
    'generations',
    'jobs',
    'characters',
    'projects',
    'project_items',
    'usage_logs',
    'payments'
  ];
  
  console.log('🔍 Checking schema deployment...\n');
  
  let allGood = true;
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error && error.code === 'PGRST116') {
        console.log(`❌ ${table} - table not found`);
        allGood = false;
      } else if (error) {
        console.log(`⚠️  ${table} - ${error.message}`);
      } else {
        console.log(`✅ ${table} - OK`);
      }
    } catch (err) {
      console.log(`❌ ${table} - ${err.message}`);
      allGood = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allGood) {
    console.log('✅ Schema deployed successfully!\n');
  } else {
    console.log('❌ Some tables are missing. Re-run SQL in Supabase.\n');
  }
}

checkSchema().catch(console.error);
