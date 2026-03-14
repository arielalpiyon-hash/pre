import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('═'.repeat(100));
console.log('🧪 בדיקת זרימה מלאה: מרכיב הצ\'אט עד התשובה הסופית');
console.log('═'.repeat(100));
console.log();

const testQuestion = 'מה זה צו ראשון';
console.log(`📝 שאלת משתמש: "${testQuestion}"`);
console.log();

console.log('━'.repeat(100));
console.log('שלב 1: searchKnowledgeBase - חיפוש בדאטאבייס');
console.log('━'.repeat(100));

async function searchKnowledgeBase(userQuestion) {
  if (!userQuestion || userQuestion.trim().length === 0) {
    return [];
  }

  const searchTerm = userQuestion.trim().toLowerCase();
  const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 2);

  console.log(`   🔤 טרם חיפוש: "${searchTerm}"`);
  console.log(`   📚 מילות חיפוש: [${searchWords.map(w => `"${w}"`).join(', ')}]`);

  try {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*');

    if (error) {
      console.error('   ❌ שגיאה:', error);
      return [];
    }

    console.log(`   ✅ נשלפו ${data.length} רשומות מהטבלה`);

    const scoredResults = data.map((entry) => {
      let score = 0;

      if (entry.question?.toLowerCase().includes(searchTerm)) {
        score += 100;
      }

      searchWords.forEach(word => {
        if (entry.question?.toLowerCase().includes(word)) {
          score += 15;
        }
      });

      if (entry.question_variants && Array.isArray(entry.question_variants)) {
        entry.question_variants.forEach((variant) => {
          if (variant?.toLowerCase().includes(searchTerm)) {
            score += 80;
          }
          searchWords.forEach(word => {
            if (variant?.toLowerCase().includes(word)) {
              score += 12;
            }
          });
        });
      }

      if (entry.user_intents && Array.isArray(entry.user_intents)) {
        entry.user_intents.forEach((intent) => {
          if (intent?.toLowerCase().includes(searchTerm)) {
            score += 70;
          }
          searchWords.forEach(word => {
            if (intent?.toLowerCase().includes(word)) {
              score += 10;
            }
          });
        });
      }

      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag) => {
          if (tag?.toLowerCase().includes(searchTerm)) {
            score += 50;
          }
          searchWords.forEach(word => {
            if (tag?.toLowerCase().includes(word)) {
              score += 8;
            }
          });
        });
      }

      if (entry.search_text?.toLowerCase().includes(searchTerm)) {
        score += 30;
      }
      searchWords.forEach(word => {
        if (entry.search_text?.toLowerCase().includes(word)) {
          score += 5;
        }
      });

      return { ...entry, score };
    });

    const filteredResults = scoredResults
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);

    console.log(`   🎯 נמצאו ${filteredResults.length} תוצאות רלוונטיות`);

    const resultsCount = Math.min(Math.max(filteredResults.length, 3), 6);
    const finalResults = filteredResults.slice(0, resultsCount);

    console.log(`   📦 מחזיר ${finalResults.length} תוצאות (3-6 הטובות ביותר)`);
    console.log();
    console.log('   🏆 תוצאות שהוחזרו:');
    finalResults.forEach((result, index) => {
      console.log(`      ${index + 1}. [ציון: ${result.score}] ${result.question}`);
    });

    return finalResults.map(({ score, ...entry }) => entry);

  } catch (err) {
    console.error('   ❌ שגיאה:', err);
    return [];
  }
}

const knowledgeResults = await searchKnowledgeBase(testQuestion);

console.log();
console.log('━'.repeat(100));
console.log('שלב 2: buildAnswerFromKnowledgeBase - בניית תשובה');
console.log('━'.repeat(100));

function buildAnswerFromKnowledgeBase(entries) {
  console.log(`   📥 קיבל ${entries.length} רשומות`);

  if (entries.length === 0) {
    console.log('   ⚠️  אין רשומות - מחזיר מחרוזת ריקה');
    return '';
  }

  const sections = [];
  const primary = entries[0];

  console.log(`   ✅ רשומה ראשית: "${primary.question}"`);
  console.log(`   📄 תשובה: ${primary.answer.substring(0, 100)}...`);

  sections.push(primary.answer);

  if (entries.length > 1) {
    sections.push('');
    sections.push('**מידע נוסף רלוונטי:**');
    entries.slice(1, 3).forEach(entry => {
      sections.push(`• ${entry.question}`);
    });
    console.log(`   ➕ הוספת ${Math.min(entries.length - 1, 2)} רשומות נוספות`);
  }

  const answer = sections.join('\n');
  console.log();
  console.log('   📤 תשובה שנבנתה:');
  console.log('   ┌' + '─'.repeat(98));
  answer.split('\n').forEach(line => {
    console.log('   │ ' + line);
  });
  console.log('   └' + '─'.repeat(98));

  return answer;
}

const finalAnswer = buildAnswerFromKnowledgeBase(knowledgeResults);

console.log();
console.log('━'.repeat(100));
console.log('שלב 3: התוצאה הסופית שמוחזרת למשתמש');
console.log('━'.repeat(100));

if (finalAnswer) {
  console.log('✅ נמצאה תשובה - מוחזרת למשתמש');
  console.log();
  console.log('📱 מה שהמשתמש רואה במסך:');
  console.log('┏' + '━'.repeat(98));
  finalAnswer.split('\n').forEach(line => {
    console.log('┃ ' + line);
  });
  console.log('┗' + '━'.repeat(98));
} else {
  console.log('⚠️  לא נמצאה תשובה - מופעלת הודעת ברירת מחדל:');
  console.log();
  console.log('📱 מה שהמשתמש רואה במסך:');
  console.log('┏' + '━'.repeat(98));
  console.log('┃ מצטערים, לא מצאנו מידע ספציפי על נושא זה. מומלץ לפנות למדריכים בבית');
  console.log('┃ הגיוס או לבדוק באתר צה"ל הרשמי לקבלת מידע מדויק ועדכני.');
  console.log('┗' + '━'.repeat(98));
}

console.log();
console.log('━'.repeat(100));
console.log('📍 היכן נמצאת הודעת ברירת המחדל?');
console.log('━'.repeat(100));
console.log();
console.log('   📁 קובץ: src/utils/agentSearch.ts');
console.log('   📍 שורות: 85-87');
console.log('   🔍 תנאי: כאשר knowledgeResults.length === 0 וגם לא נמצאו מסלולים');
console.log();
console.log('   הקוד:');
console.log('   ┌─────────────────────────────────────────────────────────────────');
console.log('   │ return persona === \'parent\'');
console.log('   │   ? \'מצטערים, לא מצאנו מידע ספציפי על נושא זה...\'');
console.log('   │   : \'מצטערים, לא מצאנו מידע ספציפי על נושא זה...\';');
console.log('   └─────────────────────────────────────────────────────────────────');
console.log();

console.log('═'.repeat(100));
console.log('✅ בדיקה הושלמה בהצלחה!');
console.log('═'.repeat(100));
console.log();
console.log('📊 סיכום הזרימה:');
console.log('   1️⃣  AskQuestionModal (src/components/AskQuestionModal.tsx:35)');
console.log('       → קורא ל-searchWithAgent');
console.log();
console.log('   2️⃣  searchWithAgent (src/utils/agentSearch.ts:51)');
console.log('       → קורא ל-searchKnowledgeBase');
console.log();
console.log('   3️⃣  searchKnowledgeBase (src/utils/knowledgeBaseSearch.ts:20)');
console.log('       → מחפש בטבלת knowledge_base ב-Supabase');
console.log('       → מחזיר 3-6 תוצאות רלוונטיות');
console.log();
console.log('   4️⃣  buildAnswerFromKnowledgeBase (src/utils/agentSearch.ts:14)');
console.log('       → בונה תשובה מהתוצאות');
console.log();
console.log('   5️⃣  החזרה למשתמש דרך AskQuestionModal');
console.log('       → מציג את התשובה במסך');
console.log();
