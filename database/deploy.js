// Deploy schema to Supabase using PostgreSQL client
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function deploySchema() {
  // Load env
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Read schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  console.log('📦 Deploying schema to Supabase...');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    // Split SQL into statements (simple approach)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements`);
    
    // Execute via RPC (if available) or direct
    // For now, we'll use Supabase SQL editor approach
    
    // Alternative: Use psql connection string
    const { Pool } = require('pg');
    
    // Extract DB connection from Supabase URL
    const dbUrl = supabaseUrl.replace('https://', 'postgresql://postgres:')
      + '.supabase.co:5432/postgres';
    
    console.log('Note: For full schema deployment, use Supabase Dashboard SQL Editor');
    console.log('Or connect via psql and run:');
    console.log(`psql "${dbUrl}" < database/schema.sql`);
    
    // For basic tables, we can use Supabase client
    console.log('\n✅ Schema file ready at: database/schema.sql');
    console.log('Please deploy via:');
    console.log('1. Supabase Dashboard → SQL Editor');
    console.log('2. Paste schema.sql content');
    console.log('3. Run query');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deploySchema();
