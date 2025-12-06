const fs = require('fs');
const https = require('https');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Read the migration file
const migrationSQL = fs.readFileSync(
  'supabase/migrations/20251206073944_add_theme_previews_table.sql',
  'utf8'
);

console.log('🚀 Running migration to create theme_previews table...\n');

// Extract the project ID from URL
const projectId = SUPABASE_URL.replace('https://', '').split('.')[0];

// Use Supabase Management API
const url = new URL(SUPABASE_URL);
const options = {
  hostname: url.hostname,
  port: 443,
  path: '/rest/v1/rpc/query',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Prefer': 'params=single-object'
  }
};

const data = JSON.stringify({
  query: migrationSQL
});

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Migration completed successfully!');
      console.log('\nThe theme_previews table has been created.');
      console.log('You can now use the "Try it" feature!\n');
    } else {
      console.error('❌ Migration failed with status:', res.statusCode);
      console.error('Response:', responseData);
      console.log('\n📝 Please run the migration manually:');
      console.log('1. Go to your Supabase Dashboard → SQL Editor');
      console.log('2. Copy the contents of: supabase/migrations/20251206073944_add_theme_previews_table.sql');
      console.log('3. Paste and run it\n');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error running migration:', error.message);
  console.log('\n📝 Please run the migration manually:');
  console.log('1. Go to your Supabase Dashboard → SQL Editor');
  console.log('2. Copy the contents of: supabase/migrations/20251206073944_add_theme_previews_table.sql');
  console.log('3. Paste and run it\n');
});

req.write(data);
req.end();
