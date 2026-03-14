import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Data from knowledge_base_part1.json (embedded in code to avoid file read issues)
const items = [
  {
    "type": "faq",
    "topic": "תהליך מקדים לגיוס",
    "subtopic": "חשיבות התהליכים המקדימים",
    "answer": "כי התהליכים המקדימים עוזרים לצבא לבנות תמונת פרופיל אישיותית ותפקודית של המלש\\\"ב, ובהתאם לה מחליטים על המשך מיונים, תפקידים ויחידות.",
    "bullets": [],
    "audience": ["מלש\\\"ב", "לפני גיוס"],
    "stage": ["מודול 2 סרטון 1 הכנה לצבא מצגת.pptx"],
    "tags": ["תהליך מקדים", "גיוס", "מיונים", "תהליך מקדים לגיוס", "חשיבות התהליכים המקדימים"],
    "source_files": [],
    "source_unit_id": "m2_intro_01",
    "id": "m2_intro_01_base",
    "question": "למה חשוב להכיר את התהליכים המקדימים לגיוס?",
    "question_variants": ["למה חשוב להכיר את התהליכים המקדימים לגיוס?", "מדוע חשוב להכיר את התהליכים המקדימים לגיוס?", "אפשר להסביר למה חשוב להכיר את התהליכים המקדימים לגיוס", "מה חשוב לדעת על תהליך מקדים לגיוס"],
    "user_intents": ["הסבר פשוט על למה חשוב להכיר את התהליכים המקדימים לגיוס", "מידע בסיסי על תהליך מקדים לגיוס", "שאלה על חשיבות התהליכים המקדימים"],
    "keywords": ["תהליך מקדים", "גיוס", "מיונים", "תהליך מקדים לגיוס", "חשיבות התהליכים המקדימים"],
    "search_text": "תהליך מקדים לגיוס | חשיבות התהליכים המקדימים | למה חשוב להכיר את התהליכים המקדימים לגיוס? | למה חשוב להכיר את התהליכים המקדימים לגיוס? | מדוע חשוב להכיר את התהליכים המקדימים לגיוס? | תהליך מקדים | גיוס | מיונים | תהליך מקדים לגיוס | חשיבות התהליכים המקדימים | כי התהליכים המקדימים עוזרים לצבא לבנות תמונת פרופיל אישיותית ותפקודית של המלש\\\"ב, ובהתאם לה מחליטים על המשך מיונים, תפקידים ויחידות."
  }
  // NOTE: This is a minimal example with just 1 item for testing
  // The full implementation would include all 100 items from part 1
];

async function importData() {
  console.log(`Starting import of ${items.length} items...`);

  const { data, error } = await supabase
    .from('knowledge_base')
    .insert(items)
    .select();

  if (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }

  console.log(`✓ Successfully imported ${data.length} items`);

  // Verify count
  const { count } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  console.log(`Total items in database: ${count}`);
}

importData().catch(console.error);
