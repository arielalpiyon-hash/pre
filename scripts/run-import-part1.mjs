#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables manually
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Starting import of knowledge_base_part1.json...\n');

// Check current count
const { count: initialCount } = await supabase
  .from('knowledge_base')
  .select('*', { count: 'exact', head: true });

console.log(`Current items in database: ${initialCount}\n`);

// This script will be executed with the actual data
// For now, let's create a test entry to verify the process works
const testItem = {
  "type": "faq",
  "topic": "test_import",
  "subtopic": "verification",
  "answer": "This is a test import to verify the process works",
  "bullets": [],
  "audience": ["test"],
  "stage": ["test"],
  "tags": ["test"],
  "source_files": [],
  "source_unit_id": "test_001",
  "id": "test_import_verification",
  "question": "Is the import process working?",
  "question_variants": ["Is it working?"],
  "user_intents": ["test"],
  "keywords": ["test"],
  "search_text": "test import verification"
};

const { data, error } = await supabase
  .from('knowledge_base')
  .insert([testItem])
  .select();

if (error) {
  console.error('❌ Import failed:', error.message);
  process.exit(1);
}

console.log(`✅ Test import successful: ${data.length} item(s) added\n`);

// Verify
const { count: finalCount } = await supabase
  .from('knowledge_base')
  .select('*', { count: 'exact', head: true });

console.log(`Final count: ${finalCount} items`);
console.log(`Items added: ${finalCount - initialCount}`);
