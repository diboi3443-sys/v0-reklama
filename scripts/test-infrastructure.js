// Test infrastructure connections
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Redis = require('ioredis');

async function testSupabase() {
  console.log('\n🗄️  Testing Supabase...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  try {
    // Test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = table doesn't exist (which is ok if schema not deployed)
      throw error;
    }
    
    console.log('✅ Supabase connected');
    console.log(`   URL: ${process.env.SUPABASE_URL}`);
    
    // Test storage
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketError) {
      console.log('⚠️  Storage: ', bucketError.message);
    } else {
      console.log(`✅ Storage accessible (${buckets.length} buckets)`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Supabase error:', error.message);
    return false;
  }
}

async function testRedis() {
  console.log('\n🔴 Testing Redis...');
  
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.log('⚠️  REDIS_URL not set in .env.local');
    console.log('   See docs/REDIS_SETUP.md for setup instructions');
    return false;
  }
  
  try {
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000)
    });
    
    // Test SET
    await redis.set('test:connection', 'ok', 'EX', 10);
    
    // Test GET
    const value = await redis.get('test:connection');
    
    if (value !== 'ok') {
      throw new Error('SET/GET mismatch');
    }
    
    // Test DEL
    await redis.del('test:connection');
    
    console.log('✅ Redis connected');
    console.log(`   URL: ${redisUrl.split('@')[1] || 'localhost:6379'}`);
    
    await redis.quit();
    return true;
  } catch (error) {
    console.error('❌ Redis error:', error.message);
    console.log('   Make sure Redis is running or Upstash is configured');
    return false;
  }
}

async function testOpenRouter() {
  console.log('\n🤖 Testing OpenRouter...');
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log('⚠️  OPENROUTER_API_KEY not set');
    return false;
  }
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ OpenRouter API accessible');
    console.log(`   Available models: ${data.data?.length || 0}`);
    
    return true;
  } catch (error) {
    console.error('❌ OpenRouter error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔧 v0-reklama Infrastructure Test\n');
  console.log('=' .repeat(50));
  
  const results = {
    supabase: await testSupabase(),
    redis: await testRedis(),
    openrouter: await testOpenRouter()
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:\n');
  
  Object.entries(results).forEach(([name, status]) => {
    console.log(`   ${status ? '✅' : '❌'} ${name}`);
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 All systems operational!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some systems need attention\n');
    console.log('Next steps:');
    if (!results.supabase) console.log('  1. Deploy database schema (see database/schema.sql)');
    if (!results.redis) console.log('  2. Setup Redis (see docs/REDIS_SETUP.md)');
    if (!results.openrouter) console.log('  3. Add OPENROUTER_API_KEY to .env.local');
    console.log('');
    process.exit(1);
  }
}

main();
