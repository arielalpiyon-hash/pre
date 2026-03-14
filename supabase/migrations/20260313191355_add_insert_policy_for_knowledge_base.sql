/*
  # הוספת policy להכנסת נתונים לטבלת knowledge_base

  1. Security Changes
    - הוספת policy שמאפשרת הכנסת נתונים (INSERT)
    - הוספת policy שמאפשרת קריאת נתונים (SELECT) לכולם
    
  2. הערות
    - Policy זה מאפשר לכל משתמש מאומת להוסיף רשומות
    - בעתיד ניתן להגביל את זה רק למנהלים
*/

-- מחיקת policies קיימים אם יש
DROP POLICY IF EXISTS "Allow authenticated insert" ON knowledge_base;
DROP POLICY IF EXISTS "Allow public read" ON knowledge_base;

-- policy להכנסת נתונים למשתמשים מאומתים
CREATE POLICY "Allow authenticated insert"
  ON knowledge_base
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- policy לקריאת נתונים לכולם (כולל משתמשים לא מאומתים)
CREATE POLICY "Allow public read"
  ON knowledge_base
  FOR SELECT
  TO public
  USING (true);
