/*
  # הוספת עמודות חסרות לטבלת knowledge_base

  1. שינויים
    - הוספת עמודה type (סוג הרשומה: faq, concept, guide, template)
    - הוספת עמודה keywords (מילות מפתח לחיפוש)
    - הוספת עמודה audience (קהל יעד)
    - הוספת עמודה stage (שלב מקור)
    - הוספת עמודה source_files (קבצי מקור)
    - הוספת עמודה source_unit_id (מזהה יחידה ממקור)
    
  2. הערות
    - כל העמודות הן אופציונליות כדי לא לשבור רשומות קיימות
    - השדות מסוג JSONB לתמיכה במבנים מורכבים
*/

-- הוספת עמודות חדשות
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base' AND column_name = 'type'
  ) THEN
    ALTER TABLE knowledge_base ADD COLUMN type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base' AND column_name = 'keywords'
  ) THEN
    ALTER TABLE knowledge_base ADD COLUMN keywords jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base' AND column_name = 'audience'
  ) THEN
    ALTER TABLE knowledge_base ADD COLUMN audience jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base' AND column_name = 'stage'
  ) THEN
    ALTER TABLE knowledge_base ADD COLUMN stage jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base' AND column_name = 'source_files'
  ) THEN
    ALTER TABLE knowledge_base ADD COLUMN source_files jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'knowledge_base' AND column_name = 'source_unit_id'
  ) THEN
    ALTER TABLE knowledge_base ADD COLUMN source_unit_id text;
  END IF;
END $$;

-- יצירת אינדקסים לשיפור ביצועים
CREATE INDEX IF NOT EXISTS idx_knowledge_base_type ON knowledge_base(type);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_source_unit_id ON knowledge_base(source_unit_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_audience ON knowledge_base USING gin(audience);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_keywords ON knowledge_base USING gin(keywords);
