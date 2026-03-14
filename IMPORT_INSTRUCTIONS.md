# הוראות ייבוא בסיס הידע

## מצב נוכחי
- ✅ הטבלה `knowledge_base` מוכנה וכוללת את כל השדות הנדרשים
- ✅ RLS policies מוגדרים ומאפשרים ייבוא
- ✅ הסקריפט מוכן לייבוא אוטומטי

## דרך מהירה - ייבוא אוטומטי של כל הקבצים

### שלב 1: הכנת הקבצים
העתק את כל 5 קבצי ה-JSON לתיקיית הפרויקט (לא לתת-תיקייה):
```
knowledge_base_part1.json
knowledge_base_part2.json
knowledge_base_part3.json
knowledge_base_part4.json
knowledge_base_part5.json
```

### שלב 2: הרץ ייבוא אוטומטי
```bash
npm run import:all
```

זהו! הסקריפט:
- ✅ יקרא את כל 5 הקבצים אוטומטית
- ✅ יייבא את כל הרשומות
- ✅ ידלג על כפילויות
- ✅ יציג התקדמות בזמן אמת
- ✅ יציג סיכום מפורט בסוף

### שלב 3: אמת את הייבוא
```bash
npm run import:verify
```

---

## דרך חלופית - ייבוא קובץ בודד

אם אתה רוצה לייבא קובץ בודד:

```bash
npm run import:single ./knowledge_base_part1.json
```

או ישירות:

```bash
node scripts/import-json-file.mjs ./knowledge_base_part1.json
```

## פורמט הקובץ

כל קובץ JSON צריך להכיל:

```json
{
  "version": "2.0.0",
  "part": 1,
  "total_parts": 5,
  "items": [
    {
      "id": "unique_id",
      "type": "faq",
      "topic": "נושא",
      "subtopic": "תת-נושא",
      "question": "השאלה",
      "question_variants": ["וריאציה 1", "וריאציה 2"],
      "user_intents": ["כוונה 1"],
      "keywords": ["מילה 1", "מילה 2"],
      "answer": "התשובה",
      "bullets": [],
      "audience": ["קהל יעד"],
      "stage": ["שלב"],
      "tags": ["תג 1"],
      "source_files": [],
      "source_unit_id": "source_id",
      "search_text": "טקסט לחיפוש"
    }
  ]
}
```

## טיפול בשגיאות

### כפילויות
אם רשומה עם אותו `id` כבר קיימת, היא תדלג אוטומטית.

### שגיאות אחרות
הסקריפט ידווח על שגיאות ויציג את מספר הבאץ' והשגיאה.

## בדיקת סטטוס

לבדיקת כמה רשומות כבר בטבלה:

```bash
node -e "import('fs').then(fs => {
  const env = fs.readFileSync('.env', 'utf-8');
  const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
  const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
  import('@supabase/supabase-js').then(({ createClient }) => {
    const supabase = createClient(url, key);
    supabase.from('knowledge_base').select('*', { count: 'exact', head: true })
      .then(({ count }) => console.log('Total items:', count));
  });
})"
```

## מבנה הטבלה

הטבלה `knowledge_base` כוללת את השדות הבאים:

| שדה | סוג | תיאור |
|-----|-----|--------|
| id | text | מזהה ייחודי (PK) |
| type | text | סוג הרשומה (faq, concept, guide, template) |
| topic | text | נושא ראשי |
| subtopic | text | תת-נושא |
| question | text | השאלה הראשית |
| question_variants | jsonb | וריאציות של השאלה |
| user_intents | jsonb | כוונות משתמש |
| keywords | jsonb | מילות מפתח |
| answer | text | התשובה |
| bullets | jsonb | נקודות מפתח |
| audience | jsonb | קהל יעד |
| stage | jsonb | שלב במקור |
| tags | jsonb | תגיות |
| source_files | jsonb | קבצי מקור |
| source_unit_id | text | מזהה יחידה במקור |
| search_text | text | טקסט לחיפוש מלא |
| created_at | timestamptz | תאריך יצירה (אוטומטי) |
