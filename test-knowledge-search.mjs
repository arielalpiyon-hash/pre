import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ththgzpguohhkhdmbpcj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodGhnenBndW9oaGtoZG1icGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyOTg3MzksImV4cCI6MjA4ODg3NDczOX0.-eNfNmmP0qrkqnMXq6QQmGJnE4K9kiZzdxr4C8q0A5s';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// פונקציית חיפוש זהה לזו שבקוד
async function searchKnowledgeBase(userQuestion) {
  if (!userQuestion || userQuestion.trim().length === 0) {
    return [];
  }

  const searchTerm = userQuestion.trim().toLowerCase();
  const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 2);

  try {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*');

    if (error) {
      console.error('Error fetching knowledge base:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

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

    const resultsCount = Math.min(Math.max(filteredResults.length, 3), 6);
    return filteredResults.slice(0, resultsCount).map(({ score, ...entry }) => ({ ...entry, score }));

  } catch (err) {
    console.error('Unexpected error in searchKnowledgeBase:', err);
    return [];
  }
}

// שאלות בדיקה
const testQuestions = [
  'איך מתכוננים למיונים?',
  'מה זה פרופיל 97?',
  'איך לבחור יחידה בצבא?',
  'מה ההבדל בין קבע וחובה?',
  'איך להתמודד עם לחץ בצבא?'
];

console.log('🔍 בודק את מערכת החיפוש בבסיס הידע\n');
console.log('='.repeat(80));

for (const question of testQuestions) {
  console.log(`\n📝 שאלה: "${question}"`);
  console.log('-'.repeat(80));

  const results = await searchKnowledgeBase(question);

  console.log(`✅ נמצאו ${results.length} תוצאות:\n`);

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.question}`);
    console.log(`   נושא: ${result.topic} > ${result.subtopic}`);
    console.log(`   ציון רלוונטיות: ${result.score}`);
    console.log(`   תגיות: ${result.tags?.slice(0, 3).join(', ')}`);
    if (result.answer) {
      const shortAnswer = result.answer.substring(0, 100).replace(/\n/g, ' ');
      console.log(`   תשובה: ${shortAnswer}...`);
    }
    console.log('');
  });
}

console.log('='.repeat(80));
console.log('✅ בדיקה הושלמה בהצלחה!');
