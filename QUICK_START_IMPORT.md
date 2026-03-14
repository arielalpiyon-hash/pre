# 🚀 התחלה מהירה - ייבוא בסיס הידע

## ✅ המערכת מוכנה לייבוא!

כל מה שצריך לעשות:

### 1️⃣ העתק את הקבצים
שים את 5 הקבצים האלה בתיקיית הפרויקט הראשית:
```
knowledge_base_part1.json
knowledge_base_part2.json
knowledge_base_part3.json
knowledge_base_part4.json
knowledge_base_part5.json
```

### 2️⃣ הרץ ייבוא
```bash
npm run import:all
```

### 3️⃣ בדוק תוצאות
```bash
npm run import:verify
```

זהו! 🎉

---

## מה הסקריפט עושה?

הסקריפט `auto-import-all.mjs`:

1. ✅ **קורא** את כל 5 קבצי ה-JSON מתיקיית הפרויקט
2. ✅ **מפרק** את ה-JSON של כל קובץ
3. ✅ **מייבא** את כל הרשומות לטבלת `knowledge_base` ב-Supabase
4. ✅ **ממפה** נכון את כל השדות:
   - id, type, topic, subtopic
   - question, question_variants, user_intents
   - keywords, answer, bullets
   - audience, stage, tags
   - source_files, source_unit_id, search_text
5. ✅ **מוסיף** רשומות לטבלה ללא מחיקת רשומות קיימות
6. ✅ **מונע כפילויות** - דולג אוטומטית על רשומות עם אותו id
7. ✅ **מדווח** כמה רשומות ייובאו מכל קובץ
8. ✅ **מציג סיכום** מפורט בסוף

---

## פורמט הנתונים

כל רשומה מכילה:
- **id** - מזהה ייחודי
- **type** - סוג (faq, concept, guide, template)
- **topic** - נושא ראשי
- **subtopic** - תת-נושא
- **question** - השאלה הראשית
- **question_variants** - וריאציות של השאלה (array)
- **user_intents** - כוונות משתמש (array)
- **keywords** - מילות מפתח (array)
- **answer** - התשובה
- **bullets** - נקודות מפתח (array)
- **audience** - קהל יעד (array)
- **stage** - שלב במקור (array)
- **tags** - תגיות (array)
- **source_files** - קבצי מקור (array)
- **source_unit_id** - מזהה יחידה במקור
- **search_text** - טקסט מלא לחיפוש

---

## פקודות נוספות

### ייבוא קובץ בודד
```bash
npm run import:single ./knowledge_base_part1.json
```

### אימות מצב הטבלה
```bash
npm run import:verify
```

### אימות ידני
```bash
node -e "import('@supabase/supabase-js').then(m => m.createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY).from('knowledge_base').select('*', {count:'exact',head:true}).then(r=>console.log('Total:',r.count)))"
```

---

## מה קורה אם...

### הקבצים לא בתיקייה הנכונה?
הסקריפט יודיע: `❌ הקובץ לא נמצא`

### יש רשומות כפולות?
הסקריפט ידלג עליהן אוטומטית ויציג: `⚠️ כפילויות (דולגו): X רשומות`

### יש שגיאה בקובץ?
הסקריפט יציג את השגיאה וימשיך לקבצים הבאים

### רוצה להריץ שוב?
אין בעיה! הסקריפט מונע כפילויות אוטומטית

---

## תמיכה

אם משהו לא עובד:
1. בדוק שהקבצים בתיקיית הפרויקט הראשית
2. וודא ש-`.env` מכיל את משתני Supabase
3. הרץ `npm run import:verify` לבדיקת מצב
4. בדוק שהטבלה `knowledge_base` קיימת ב-Supabase

---

**מוכן לייבוא? העתק את הקבצים והרץ `npm run import:all`** 🚀
