import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env');
const envFile = readFileSync(envPath, 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const questions = [
  {
    "topic": "יחידות מיוחדות",
    "question": "איך מגיעים לשלדג"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "איך מתקבלים לסיירת מטכ״ל"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "איך מגיעים ליחידה 669"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "איך מתקבלים לשייטת 13"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "איך מגיעים למגלן"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "איך מגיעים לדובדבן"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "איך מתקבלים ליהל״ם"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "איך מגיעים לאגוז"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "איך מגיעים ליחידת קומנדו"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "מה ההבדל בין שלדג למטכ״ל"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "מה ההבדל בין מגלן לדובדבן"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "כמה אנשים מתקבלים לשלדג כל שנה"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "האם אפשר להגיע לשלדג אחרי גיוס"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "איזה פרופיל צריך לשלדג"
  },
  {
    "topic": "יחידות מיוחדות",
    "question": "האם אפשר להגיע ל669 בלי יום סיירות"
  },
  {
    "topic": "יום סיירות",
    "question": "מה זה יום סיירות"
  },
  {
    "topic": "יום סיירות",
    "question": "איך מקבלים זימון ליום סיירות"
  },
  {
    "topic": "יום סיירות",
    "question": "איך להתכונן ליום סיירות"
  },
  {
    "topic": "יום סיירות",
    "question": "מה בודקים ביום סיירות"
  },
  {
    "topic": "יום סיירות",
    "question": "איך להצליח ביום סיירות"
  },
  {
    "topic": "יום סיירות",
    "question": "איזה יחידות אפשר לקבל ביום סיירות"
  },
  {
    "topic": "יום סיירות",
    "question": "מה קורה אם לא עוברים יום סיירות"
  },
  {
    "topic": "יום סיירות",
    "question": "כמה זמן נמשך יום סיירות"
  },
  {
    "topic": "גיבושים",
    "question": "מה זה גיבוש בצבא"
  },
  {
    "topic": "גיבושים",
    "question": "איך להתכונן לגיבוש"
  },
  {
    "topic": "גיבושים",
    "question": "מה בודקים בגיבוש"
  },
  {
    "topic": "גיבושים",
    "question": "איך מתבלטים בגיבוש"
  },
  {
    "topic": "גיבושים",
    "question": "מה גורם לאנשים ליפול בגיבוש"
  },
  {
    "topic": "גיבושים",
    "question": "כמה זמן נמשך גיבוש"
  },
  {
    "topic": "גיבושים",
    "question": "איך להתנהג בגיבוש"
  },
  {
    "topic": "גיבושים",
    "question": "מה לעשות אם לא עברתי גיבוש"
  },
  {
    "topic": "מיונים לצבא",
    "question": "איך לבחור תפקיד בצבא"
  },
  {
    "topic": "מיונים לצבא",
    "question": "איך למצוא תפקיד שמתאים לי בצבא"
  },
  {
    "topic": "מיונים לצבא",
    "question": "איך לבחור מסלול בצה״ל שמתאים לי"
  },
  {
    "topic": "מיונים לצבא",
    "question": "איך להגיע לתפקיד משמעותי בצבא"
  },
  {
    "topic": "מיונים לצבא",
    "question": "איך להגדיל סיכוי לקבל מיונים טובים"
  },
  {
    "topic": "מיונים לצבא",
    "question": "מה משפיע על הזימונים שמקבלים בצבא"
  },
  {
    "topic": "מיונים לצבא",
    "question": "איך לבקש מיונים נוספים מהצבא"
  },
  {
    "topic": "מיונים לצבא",
    "question": "איך להתנהל נכון בתהליך המיונים"
  },
  {
    "topic": "מיונים לצבא",
    "question": "איך לשפר סיכוי להגיע לתפקיד שרוצים"
  },
  {
    "topic": "מיונים לצבא",
    "question": "איך לבחור בין כמה מיונים"
  },
  {
    "topic": "התאמה אישית לצבא",
    "question": "איך לדעת אם אני מתאים לקרבי"
  },
  {
    "topic": "התאמה אישית לצבא",
    "question": "איך לדעת אם אני מתאים ליחידות מיוחדות"
  },
  {
    "topic": "התאמה אישית לצבא",
    "question": "איך לדעת אם אני מתאים למודיעין"
  },
  {
    "topic": "התאמה אישית לצבא",
    "question": "איך להבין במה אני טוב לפני הגיוס"
  },
  {
    "topic": "התאמה אישית לצבא",
    "question": "איך לזהות את החוזקות שלי לפני הצבא"
  },
  {
    "topic": "התאמה אישית לצבא",
    "question": "איך לבחור מסלול שמתאים לאופי שלי"
  },
  {
    "topic": "התאמה אישית לצבא",
    "question": "איך לבחור מסלול שלא אתחרט עליו"
  },
  {
    "topic": "התאמה אישית לצבא",
    "question": "איך לחשוב נכון על השירות הצבאי"
  },
  {
    "topic": "התפתחות אישית לפני צבא",
    "question": "איך להתכונן מנטלית לשירות קרבי"
  },
  {
    "topic": "התפתחות אישית לפני צבא",
    "question": "איך להתמודד עם פחד מהצבא"
  },
  {
    "topic": "התפתחות אישית לפני צבא",
    "question": "איך לבנות ביטחון עצמי לפני הגיוס"
  },
  {
    "topic": "התפתחות אישית לפני צבא",
    "question": "איך להפוך את השירות הצבאי להזדמנות"
  },
  {
    "topic": "התפתחות אישית לפני צבא",
    "question": "איך להגיע לשירות משמעותי גם אם אני לא הכי חזק"
  },
  {
    "topic": "התפתחות אישית לפני צבא",
    "question": "איך להתכונן לשירות בלי לחץ מיותר"
  }
];

const topicToTags = {
  "יחידות מיוחדות": ["יחידות מיוחדות", "שלדג", "מטכל", "669", "שייטת", "מגלן", "דובדבן", "יהלם", "אגוז", "קומנדו"],
  "יום סיירות": ["יום סיירות", "סיירות", "מיונים", "גיוס"],
  "גיבושים": ["גיבושים", "מבחנים", "סלקציה", "מיונים"],
  "מיונים לצבא": ["מיונים", "תפקידים", "גיוס", "בחירה"],
  "התאמה אישית לצבא": ["התאמה", "בחירה", "מסלול", "תפקיד", "אישיות"],
  "התפתחות אישית לפני צבא": ["הכנה", "התפתחות אישית", "מנטלי", "ביטחון עצמי", "מוכנות"]
};

async function importQuestions() {
  console.log('Starting import of questions to knowledge_base table...');

  let successCount = 0;
  let errorCount = 0;

  for (const item of questions) {
    const id = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const record = {
      id: id,
      topic: item.topic,
      subtopic: '',
      question: item.question,
      question_variants: [],
      user_intents: [],
      answer: '',
      tags: topicToTags[item.topic] || [item.topic],
      search_text: item.question
    };

    const { error } = await supabase
      .from('knowledge_base')
      .insert(record);

    if (error) {
      console.error(`Error inserting question "${item.question}":`, error.message);
      errorCount++;
    } else {
      successCount++;
      console.log(`✓ Imported: ${item.question}`);
    }

    await new Promise(resolve => setTimeout(resolve, 10));
  }

  console.log('\n=== Import Summary ===');
  console.log(`Total questions: ${questions.length}`);
  console.log(`Successfully imported: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

importQuestions().catch(console.error);
