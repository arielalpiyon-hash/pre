/*
  # Create knowledge_base table

  1. New Tables
    - `knowledge_base`
      - `id` (text, primary key) - Unique identifier for each knowledge item
      - `topic` (text) - Main topic category (e.g., "מיונים", "הכנה")
      - `subtopic` (text) - Specific subtopic within the main topic
      - `question` (text) - The main question this knowledge item answers
      - `question_variants` (jsonb) - Array of alternative phrasings of the question
      - `user_intents` (jsonb) - Array of user intent keywords for better search matching
      - `answer` (text) - The detailed answer to the question
      - `bullets` (jsonb) - Array of bullet points with key information
      - `tags` (jsonb) - Array of searchable tags for categorization
      - `search_text` (text) - Optimized text field for full-text search
      - `created_at` (timestamptz) - Timestamp of when the record was created

  2. Security
    - Enable RLS on `knowledge_base` table
    - Add policy for public read access (knowledge base is public information)
    - Add policy for authenticated insert/update (for admin management)

  3. Indexes
    - Create index on topic for faster filtering
    - Create index on tags using GIN for array searches
    - Create full-text search index on search_text field using simple language config

  4. Notes
    - This table stores the core knowledge base for IDF recruitment guidance
    - Supports both candidates (מלש"בים) and parents
    - Uses JSONB for flexible array storage of variants, intents, bullets, and tags
*/

CREATE TABLE IF NOT EXISTS knowledge_base (
  id text PRIMARY KEY,
  topic text NOT NULL,
  subtopic text NOT NULL,
  question text NOT NULL,
  question_variants jsonb DEFAULT '[]'::jsonb,
  user_intents jsonb DEFAULT '[]'::jsonb,
  answer text NOT NULL,
  bullets jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  search_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Knowledge base is publicly readable"
  ON knowledge_base
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert knowledge"
  ON knowledge_base
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update knowledge"
  ON knowledge_base
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete knowledge"
  ON knowledge_base
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_topic ON knowledge_base(topic);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_search_text ON knowledge_base USING GIN(to_tsvector('simple', search_text));
