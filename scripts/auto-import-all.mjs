#!/usr/bin/env node
/**
 * סקריפט ייבוא אוטומטי של כל חלקי בסיס הידע
 * מייבא את כל 5 החלקים ברצף
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// טעינת משתני סביבה
const envPath = join(projectRoot, '.env');
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

// רשימת הקבצים לייבוא
const FILES = [
  'knowledge_base_part1.json',
  'knowledge_base_part2.json',
  'knowledge_base_part3.json',
  'knowledge_base_part4.json',
  'knowledge_base_part5.json'
];

/**
 * מייבא רשומות באצ'ים
 */
async function importBatch(items, batchSize = 25) {
  let successCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(batch)
      .select('id');

    if (error) {
      // בדיקת כפילויות
      if (error.message.includes('duplicate key') || error.code === '23505') {
        duplicateCount += batch.length;
      } else {
        console.error(`   ❌ שגיאה בבאץ' ${Math.floor(i / batchSize) + 1}:`, error.message);
        errorCount += batch.length;
      }
    } else {
      successCount += data.length;
    }

    // המתנה קצרה בין באצ'ים
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { successCount, errorCount, duplicateCount };
}

/**
 * מייבא קובץ בודד
 */
async function importFile(filename) {
  const filePath = join(projectRoot, filename);

  // בדיקה אם הקובץ קיים
  if (!existsSync(filePath)) {
    return {
      success: false,
      error: 'הקובץ לא נמצא',
      filename
    };
  }

  // קריאת הקובץ
  let jsonData;
  try {
    const fileContent = readFileSync(filePath, 'utf-8');
    jsonData = JSON.parse(fileContent);
  } catch (error) {
    return {
      success: false,
      error: `שגיאה בקריאת הקובץ: ${error.message}`,
      filename
    };
  }

  // בדיקת מבנה
  if (!jsonData.items || !Array.isArray(jsonData.items)) {
    return {
      success: false,
      error: 'מבנה קובץ שגוי - חסר מערך items',
      filename
    };
  }

  // ייבוא הנתונים
  const result = await importBatch(jsonData.items);

  return {
    success: true,
    filename,
    part: jsonData.part,
    itemsInFile: jsonData.items.length,
    ...result
  };
}

/**
 * פונקציה ראשית
 */
async function main() {
  console.log('='.repeat(70));
  console.log('📚 ייבוא אוטומטי של בסיס הידע המלא');
  console.log('='.repeat(70));

  // בדיקת מצב התחלתי
  const { count: initialCount } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 מצב התחלתי: ${initialCount} רשומות בטבלה\n`);

  // ייבוא כל הקבצים
  const results = [];
  let totalSuccess = 0;
  let totalErrors = 0;
  let totalDuplicates = 0;

  for (const filename of FILES) {
    process.stdout.write(`📄 מייבא ${filename}... `);

    const result = await importFile(filename);
    results.push(result);

    if (!result.success) {
      console.log(`❌ ${result.error}`);
    } else {
      console.log(`✅ ${result.successCount}/${result.itemsInFile} רשומות`);
      totalSuccess += result.successCount;
      totalErrors += result.errorCount;
      totalDuplicates += result.duplicateCount;
    }
  }

  // בדיקת מצב סופי
  const { count: finalCount } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  // סיכום
  console.log('\n' + '='.repeat(70));
  console.log('📈 סיכום כללי:');
  console.log('='.repeat(70));

  const successfulFiles = results.filter(r => r.success).length;
  const failedFiles = results.filter(r => !r.success).length;

  console.log(`\n📁 קבצים:`);
  console.log(`   ✅ ייובאו בהצלחה: ${successfulFiles}/${FILES.length}`);
  if (failedFiles > 0) {
    console.log(`   ❌ נכשלו: ${failedFiles}/${FILES.length}`);
  }

  console.log(`\n📊 רשומות:`);
  console.log(`   ✅ נוספו בהצלחה: ${totalSuccess}`);
  if (totalDuplicates > 0) {
    console.log(`   ⚠️  כפילויות (דולגו): ${totalDuplicates}`);
  }
  if (totalErrors > 0) {
    console.log(`   ❌ שגיאות: ${totalErrors}`);
  }
  console.log(`   📊 סה"כ בטבלה: ${finalCount}`);
  console.log(`   ➕ נוספו בפועל: ${finalCount - initialCount}`);

  // פירוט קבצים שנכשלו
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n⚠️  קבצים שלא ייובאו:');
    failed.forEach(f => {
      console.log(`   • ${f.filename}: ${f.error}`);
    });
  }

  console.log('\n' + '='.repeat(70));
  if (failedFiles === 0 && totalErrors === 0) {
    console.log('✅ כל הקבצים ייובאו בהצלחה!');
  } else if (successfulFiles > 0) {
    console.log('⚠️  הייבוא הושלם עם חלק מהקבצים');
  } else {
    console.log('❌ הייבוא נכשל');
  }
  console.log('='.repeat(70) + '\n');

  // יציאה עם קוד שגיאה אם היו כשלים
  if (failedFiles > 0 || totalErrors > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ שגיאה קריטית:', error.message);
  process.exit(1);
});
