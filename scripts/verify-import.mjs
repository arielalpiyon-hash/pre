#!/usr/bin/env node
/**
 * סקריפט אימות של הייבוא
 * בודק כמה רשומות נייבאו ומציג סטטיסטיקות
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

async function verify() {
  console.log('='.repeat(70));
  console.log('📊 אימות ייבוא בסיס הידע');
  console.log('='.repeat(70));

  // ספירה כללית
  const { count: totalCount } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📈 סה"כ רשומות: ${totalCount}`);

  // ספירה לפי סוג
  console.log('\n📑 פילוח לפי סוג:');
  const { data: byType } = await supabase
    .from('knowledge_base')
    .select('type')
    .not('type', 'is', null);

  const typeCounts = {};
  byType?.forEach(row => {
    typeCounts[row.type] = (typeCounts[row.type] || 0) + 1;
  });

  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} רשומות`);
  });

  // ספירה לפי נושא
  console.log('\n🏷️  פילוח לפי נושאים (10 הראשונים):');
  const { data: byTopic } = await supabase
    .from('knowledge_base')
    .select('topic')
    .limit(1000);

  const topicCounts = {};
  byTopic?.forEach(row => {
    topicCounts[row.topic] = (topicCounts[row.topic] || 0) + 1;
  });

  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  sortedTopics.forEach(([topic, count]) => {
    console.log(`   ${topic}: ${count} רשומות`);
  });

  // בדיקת רשומות ללא source_unit_id
  const { count: noSourceCount } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true })
    .is('source_unit_id', null);

  console.log(`\n⚠️  רשומות ללא source_unit_id: ${noSourceCount}`);

  // דוגמאות רשומות
  console.log('\n📄 דוגמאות (3 רשומות ראשונות):');
  const { data: samples } = await supabase
    .from('knowledge_base')
    .select('id, topic, subtopic, question')
    .limit(3);

  samples?.forEach((sample, i) => {
    console.log(`\n   ${i + 1}. ID: ${sample.id}`);
    console.log(`      נושא: ${sample.topic} > ${sample.subtopic}`);
    console.log(`      שאלה: ${sample.question}`);
  });

  // סיכום
  console.log('\n' + '='.repeat(70));
  console.log('✅ אימות הושלם');
  console.log('='.repeat(70));

  // המלצות
  const expectedTotal = 500; // 100 items * 5 parts
  if (totalCount < expectedTotal) {
    console.log(`\n⚠️  שים לב: צפויות ${expectedTotal} רשומות, אך קיימות רק ${totalCount}`);
    console.log(`   חסרות: ${expectedTotal - totalCount} רשומות`);
    console.log('   אולי לא כל הקבצים ייובאו?');
  } else if (totalCount === expectedTotal) {
    console.log('\n✅ מעולה! כל הרשומות ייובאו בהצלחה');
  }

  console.log('');
}

verify().catch(error => {
  console.error('\n❌ שגיאה:', error.message);
  process.exit(1);
});
