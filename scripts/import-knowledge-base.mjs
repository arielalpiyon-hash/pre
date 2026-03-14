#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import function
async function importKnowledgeBasePart(partNumber, items) {
  console.log(`\n📦 Importing Part ${partNumber}...`);
  console.log(`   Items to import: ${items.length}`);

  const batchSize = 25;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(items.length / batchSize);

    process.stdout.write(`   Batch ${batchNum}/${totalBatches}... `);

    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(batch)
      .select('id');

    if (error) {
      console.log(`❌ Error`);
      console.error(`   Error details:`, error.message);
      errorCount += batch.length;
    } else {
      console.log(`✓ ${data.length} items`);
      successCount += data.length;
    }
  }

  console.log(`\n✅ Part ${partNumber} completed:`);
  console.log(`   Success: ${successCount} items`);
  console.log(`   Errors: ${errorCount} items`);

  return { successCount, errorCount };
}

// Verify total count
async function verifyCount() {
  const { count, error } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Error verifying count:', error);
    return null;
  }

  return count;
}

// Main execution
async function main(partData) {
  console.log('='.repeat(60));
  console.log('📚 Knowledge Base Import Tool');
  console.log('='.repeat(60));

  const initialCount = await verifyCount();
  console.log(`\n📊 Current database count: ${initialCount} items`);

  const result = await importKnowledgeBasePart(partData.part, partData.items);

  const finalCount = await verifyCount();
  console.log(`\n📊 Final database count: ${finalCount} items`);
  console.log(`   New items added: ${finalCount - initialCount}`);

  console.log('\n' + '='.repeat(60));
  console.log('✅ Import process completed');
  console.log('='.repeat(60) + '\n');
}

// Export for use in other scripts
export { importKnowledgeBasePart, verifyCount };

// If running directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Please provide part data to import');
  console.log('Usage: node import-knowledge-base.mjs <part-data-file>');
}
