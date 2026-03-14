#!/usr/bin/env node
/**
 * סקריפט ייבוא של קבצי JSON לבסיס הידע
 * שימוש: node scripts/import-json-file.mjs <path-to-json-file>
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// טעינת משתני סביבה
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
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// קבלת נתיב הקובץ מהארגומנטים
const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ שגיאה: לא סופק נתיב לקובץ');
  console.log('\nשימוש:');
  console.log('  node scripts/import-json-file.mjs <path-to-json-file>');
  console.log('\nדוגמה:');
  console.log('  node scripts/import-json-file.mjs ./knowledge_base_part1.json');
  process.exit(1);
}

// קריאת הקובץ
let jsonData;
try {
  const fileContent = readFileSync(filePath, 'utf-8');
  jsonData = JSON.parse(fileContent);
} catch (error) {
  console.error(`❌ שגיאה בקריאת הקובץ: ${error.message}`);
  process.exit(1);
}

// בדיקת מבנה הקובץ
if (!jsonData.items || !Array.isArray(jsonData.items)) {
  console.error('❌ שגיאה: הקובץ לא מכיל מערך items');
  process.exit(1);
}

// פונקציה לייבוא באצ'ים
async function importInBatches(items, batchSize = 25) {
  console.log(`\n📦 מתחיל ייבוא של ${items.length} רשומות...`);
  console.log(`   גודל באץ': ${batchSize} רשומות\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  const duplicates = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(items.length / batchSize);

    process.stdout.write(`   באץ' ${batchNum}/${totalBatches} (רשומות ${i + 1}-${Math.min(i + batchSize, items.length)})... `);

    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(batch)
      .select('id');

    if (error) {
      // בדיקה אם השגיאה היא בגלל duplicate key
      if (error.message.includes('duplicate key') || error.code === '23505') {
        console.log(`⚠️  כפילויות`);
        duplicates.push(...batch.map(item => item.id));
        errorCount += batch.length;
      } else {
        console.log(`❌`);
        console.error(`      שגיאה: ${error.message}`);
        errors.push({ batch: batchNum, error: error.message });
        errorCount += batch.length;
      }
    } else {
      console.log(`✅ ${data.length} רשומות`);
      successCount += data.length;
    }

    // המתנה קצרה בין באצ'ים
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { successCount, errorCount, errors, duplicates };
}

// פונקציה ראשית
async function main() {
  console.log('='.repeat(70));
  console.log('📚 ייבוא בסיס ידע');
  console.log('='.repeat(70));
  console.log(`\n📄 קובץ: ${filePath}`);
  console.log(`   גרסה: ${jsonData.version || 'לא צוין'}`);
  console.log(`   חלק: ${jsonData.part || 'לא צוין'}/${jsonData.total_parts || 'לא צוין'}`);
  console.log(`   רשומות בקובץ: ${jsonData.items.length}`);

  // בדיקת מצב התחלתי
  const { count: initialCount } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 מצב התחלתי: ${initialCount} רשומות בטבלה`);

  // ייבוא הנתונים
  const result = await importInBatches(jsonData.items);

  // בדיקת מצב סופי
  const { count: finalCount } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  console.log('\n' + '='.repeat(70));
  console.log('📈 סיכום ייבוא:');
  console.log('='.repeat(70));
  console.log(`   ✅ הצלחה: ${result.successCount} רשומות`);
  console.log(`   ❌ שגיאות: ${result.errorCount} רשומות`);
  if (result.duplicates.length > 0) {
    console.log(`   ⚠️  כפילויות שדולגו: ${result.duplicates.length} רשומות`);
  }
  console.log(`   📊 סה"כ בטבלה: ${finalCount} רשומות`);
  console.log(`   ➕ נוספו: ${finalCount - initialCount} רשומות חדשות`);

  if (result.errors.length > 0) {
    console.log('\n⚠️  שגיאות:');
    result.errors.forEach(e => {
      console.log(`   באץ' ${e.batch}: ${e.error}`);
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ תהליך הייבוא הושלם');
  console.log('='.repeat(70) + '\n');
}

main().catch(error => {
  console.error('\n❌ שגיאה קריטית:', error.message);
  process.exit(1);
});
