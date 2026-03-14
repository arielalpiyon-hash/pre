import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read the JSON file content from the embedded data
const data = {
  "version": "2.0.0",
  "project": "מנהיגים לעתיד - Bolt Agent Pack",
  "language": "he",
  "part": 1,
  "total_parts": 5,
  "items_in_part": 100,
  "description": "Part 1 of split knowledge base for Bolt import",
  "schema": {
    "id": "string unique id",
    "type": "faq | concept | guide | template",
    "topic": "category",
    "subtopic": "sub category",
    "question": "main question",
    "question_variants": "alternate phrasings",
    "user_intents": "natural user asks",
    "keywords": "search keywords",
    "answer": "assistant answer",
    "bullets": "optional bullets",
    "audience": "target audience array",
    "stage": "origin stage",
    "tags": "search tags",
    "source_files": "origin files",
    "source_unit_id": "id from original base",
    "search_text": "flattened text for lexical or semantic retrieval"
  },
  "items": ${JSON.stringify(data.items, null, 2)}
};

async function importPart1() {
  console.log(`Starting import of part ${data.part}/${data.total_parts}`);
  console.log(`Items to import: ${data.items.length}`);

  // Insert items in batches
  const batchSize = 50;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < data.items.length; i += batchSize) {
    const batch = data.items.slice(i, i + batchSize);

    const { data: insertedData, error } = await supabase
      .from('knowledge_base')
      .insert(batch)
      .select();

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`Batch ${i / batchSize + 1} inserted successfully (${batch.length} items)`);
    }
  }

  console.log(`\nImport completed:`);
  console.log(`- Successfully imported: ${successCount} items`);
  console.log(`- Errors: ${errorCount} items`);

  // Verify total count in database
  const { count, error: countError } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  if (!countError) {
    console.log(`- Total items in knowledge_base table: ${count}`);
  }
}

importPart1().catch(console.error);
