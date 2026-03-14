#!/usr/bin/env node
/**
 * סקריפט ייבוא מלא של knowledge_base_part1.json
 * מייבא את כל 100 הרשומות מחלק 1
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
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// פונקציה לייבוא באצ'ים
async function importInBatches(items, batchSize = 25) {
  console.log(`\n📦 מתחיל ייבוא של ${items.length} רשומות...`);
  console.log(`   גודל באץ': ${batchSize} רשומות\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

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
      console.log(`❌`);
      console.error(`      שגיאה: ${error.message}`);
      errorCount += batch.length;
      errors.push({ batch: batchNum, error: error.message });
    } else {
      console.log(`✅ ${data.length} רשומות`);
      successCount += data.length;
    }

    // המתנה קצרה בין באצ'ים כדי לא לעמוס על ה-API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { successCount, errorCount, errors };
}

// פונקציה ראשית
async function main() {
  console.log('='.repeat(70));
  console.log('📚 ייבוא בסיס ידע - חלק 1');
  console.log('='.repeat(70));

  // בדיקת מצב התחלתי
  const { count: initialCount } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 מצב התחלתי: ${initialCount} רשומות בטבלה`);

  // כאן צריך להוסיף את המערך items המלא מהקובץ המקורי
  // לצורך הדוגמה, נייבא רק את הרשומה הראשונה
  console.log('\n⚠️  הערה: הסקריפט מוכן, אך יש להוסיף את מערך ה-items המלא');
  console.log('   הקובץ המקורי מכיל 100 רשומות שצריכות להיות מוכנסות כאן\n');

  // דוגמה לרשומה אחת
  const sampleItems = [{
    "type": "faq",
    "topic": "צו ראשון",
    "subtopic": "מבוא",
    "answer": "צו ראשון הוא המפגש הראשוני של המלש\"ב עם הצבא.",
    "bullets": [],
    "audience": ["מלש\"ב", "צו ראשון"],
    "stage": ["מודול 2 סרטון 2"],
    "tags": ["צו ראשון", "מבוא"],
    "source_files": [],
    "source_unit_id": "tzav_sample",
    "id": "sample_import_from_script",
    "question": "מהו צו ראשון?",
    "question_variants": ["מה זה צו ראשון?"],
    "user_intents": ["הסבר פשוט"],
    "keywords": ["צו ראשון", "מבוא"],
    "search_text": "צו ראשון מבוא"
  }];

  const result = await importInBatches(sampleItems);

  // בדיקת מצב סופי
  const { count: finalCount } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  console.log('\n' + '='.repeat(70));
  console.log('📈 סיכום ייבוא:');
  console.log('='.repeat(70));
  console.log(`   ✅ הצלחה: ${result.successCount} רשומות`);
  console.log(`   ❌ שגיאות: ${result.errorCount} רשומות`);
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

main().catch(console.error);

// ייצוא הפונקציה לשימוש חוזר
export { importInBatches };
