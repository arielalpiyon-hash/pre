import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables manually
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

async function searchKnowledgeBase(userQuestion) {
  console.log('\n🔍 === תחילת חיפוש ===');
  console.log(`📝 שאלת משתמש: "${userQuestion}"\n`);

  if (!userQuestion || userQuestion.trim().length === 0) {
    console.log('❌ שאלה ריקה - מחזיר מערך ריק');
    return [];
  }

  const searchTerm = userQuestion.trim().toLowerCase();
  console.log(`🔤 טרם חיפוש מנורמל: "${searchTerm}"`);

  // מילות חיפוש מהשאלה
  const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 2);
  console.log(`📚 מילות חיפוש (אורך > 2): [${searchWords.map(w => `"${w}"`).join(', ')}]`);
  console.log(`📊 מספר מילות חיפוש: ${searchWords.length}\n`);

  try {
    console.log('🗄️  שולח שאילתה ל-Supabase...');
    const startTime = Date.now();

    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*');

    const queryTime = Date.now() - startTime;
    console.log(`⏱️  זמן שאילתה: ${queryTime}ms`);

    if (error) {
      console.error('❌ שגיאה בשליפת נתונים:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('⚠️  אין נתונים בטבלה');
      return [];
    }

    console.log(`✅ נשלפו ${data.length} רשומות מהטבלה\n`);
    console.log('🧮 מחשב ציונים לכל רשומה...\n');

    // חישוב ציון רלוונטיות לכל רשומה
    const scoredResults = data.map((entry) => {
      let score = 0;
      const scoreBreakdown = {
        question_exact: 0,
        question_words: 0,
        variants_exact: 0,
        variants_words: 0,
        intents_exact: 0,
        intents_words: 0,
        tags_exact: 0,
        tags_words: 0,
        search_text_exact: 0,
        search_text_words: 0
      };

      // חיפוש בשאלה הראשית (משקל גבוה)
      if (entry.question?.toLowerCase().includes(searchTerm)) {
        scoreBreakdown.question_exact = 100;
        score += 100;
      }

      // חיפוש במילות חיפוש בודדות בשאלה
      searchWords.forEach(word => {
        if (entry.question?.toLowerCase().includes(word)) {
          scoreBreakdown.question_words += 15;
          score += 15;
        }
      });

      // חיפוש בוריאציות השאלה
      if (entry.question_variants && Array.isArray(entry.question_variants)) {
        entry.question_variants.forEach((variant) => {
          if (variant?.toLowerCase().includes(searchTerm)) {
            scoreBreakdown.variants_exact += 80;
            score += 80;
          }
          searchWords.forEach(word => {
            if (variant?.toLowerCase().includes(word)) {
              scoreBreakdown.variants_words += 12;
              score += 12;
            }
          });
        });
      }

      // חיפוש ב-user_intents
      if (entry.user_intents && Array.isArray(entry.user_intents)) {
        entry.user_intents.forEach((intent) => {
          if (intent?.toLowerCase().includes(searchTerm)) {
            scoreBreakdown.intents_exact += 70;
            score += 70;
          }
          searchWords.forEach(word => {
            if (intent?.toLowerCase().includes(word)) {
              scoreBreakdown.intents_words += 10;
              score += 10;
            }
          });
        });
      }

      // חיפוש בתגיות
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag) => {
          if (tag?.toLowerCase().includes(searchTerm)) {
            scoreBreakdown.tags_exact += 50;
            score += 50;
          }
          searchWords.forEach(word => {
            if (tag?.toLowerCase().includes(word)) {
              scoreBreakdown.tags_words += 8;
              score += 8;
            }
          });
        });
      }

      // חיפוש ב-search_text
      if (entry.search_text?.toLowerCase().includes(searchTerm)) {
        scoreBreakdown.search_text_exact = 30;
        score += 30;
      }
      searchWords.forEach(word => {
        if (entry.search_text?.toLowerCase().includes(word)) {
          scoreBreakdown.search_text_words += 5;
          score += 5;
        }
      });

      return { ...entry, score, scoreBreakdown };
    });

    // סינון רשומות עם ציון מעל 0 ומיון לפי ציון
    const filteredResults = scoredResults
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);

    console.log(`🎯 נמצאו ${filteredResults.length} רשומות רלוונטיות (ציון > 0)\n`);

    if (filteredResults.length === 0) {
      console.log('❌ אין תוצאות - הסיבות האפשריות:');
      console.log('   1. אין התאמה בין מילות החיפוש לתוכן הרשומות');
      console.log('   2. מילות החיפוש קצרות מדי (< 3 תווים)');
      console.log('   3. השאלה לא מופיעה באף אחד מהשדות: question, question_variants, user_intents, tags, search_text');
      console.log('\n📊 דוגמה לרשומה ראשונה בטבלה:');
      if (data.length > 0) {
        const sample = data[0];
        console.log(`   ID: ${sample.id}`);
        console.log(`   Question: ${sample.question}`);
        console.log(`   Tags: ${JSON.stringify(sample.tags)}`);
      }
      return [];
    }

    // הצגת top 10 תוצאות עם פירוט ציון
    console.log('🏆 Top 10 תוצאות לפי ציון:\n');
    filteredResults.slice(0, 10).forEach((result, index) => {
      console.log(`${index + 1}. [ציון: ${result.score}] ${result.question}`);
      console.log(`   ID: ${result.id}`);
      console.log(`   Topic: ${result.topic}`);
      console.log(`   פירוט ציון:`);
      Object.entries(result.scoreBreakdown).forEach(([key, value]) => {
        if (value > 0) {
          console.log(`      ${key}: ${value}`);
        }
      });
      console.log();
    });

    // החזרת 3-6 התוצאות הטובות ביותר
    const resultsCount = Math.min(Math.max(filteredResults.length, 3), 6);
    console.log(`📦 מחזיר ${resultsCount} תוצאות (בין 3-6):\n`);

    const finalResults = filteredResults.slice(0, resultsCount);
    finalResults.forEach((result, index) => {
      console.log(`${index + 1}. [ציון: ${result.score}]`);
      console.log(`   ID: ${result.id}`);
      console.log(`   Question: ${result.question}`);
      console.log(`   Topic: ${result.topic}`);
      console.log();
    });

    return finalResults.map(({ score, scoreBreakdown, ...entry }) => entry);

  } catch (err) {
    console.error('❌ שגיאה לא צפויה:', err);
    return [];
  }
}

// הרצת הטסט
console.log('🚀 מתחיל בדיקת פונקציית searchKnowledgeBase\n');
console.log('=' .repeat(80));

const testQuestion = 'מה זה צו ראשון';
const results = await searchKnowledgeBase(testQuestion);

console.log('=' .repeat(80));
console.log('\n✅ הפונקציה הסתיימה');
console.log(`📊 סה"כ תוצאות שהוחזרו: ${results.length}`);
