/*
  # התאמת policy להכנסת נתונים עם anon key

  1. Security Changes
    - שינוי policy להכנסת נתונים כך שגם anon יוכל להכניס
    - זהירות: זהו פתרון זמני לייבוא נתונים
    
  2. הערות
    - לאחר הייבוא, מומלץ להחזיר את ה-policy למצב מוגבל יותר
*/

-- מחיקת policy קיים
DROP POLICY IF EXISTS "Allow authenticated insert" ON knowledge_base;

-- policy חדש שמאפשר הכנסה גם עם anon key
CREATE POLICY "Allow insert for import"
  ON knowledge_base
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
