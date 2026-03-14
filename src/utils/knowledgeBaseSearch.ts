import { supabase } from '../lib/supabase';

export interface KnowledgeBaseEntry {
  id: string;
  topic: string;
  subtopic: string;
  question: string;
  question_variants: string[];
  user_intents: string[];
  answer: string;
  tags: string[];
  search_text: string;
}

// רשימת יחידות מיוחדות לזיהוי מדויק
const SPECIAL_UNITS = [
  'שלדג',
  'מטכ"ל', 'מטכל', 'מטכ״ל',
  '669',
  'שייטת',
  'מגלן',
  'דובדבן',
  'יהל"ם', 'יהלם', 'יהל״ם', 'יהלום',
  'אגוז',
  'עוקץ',
  'סיירת מטכ"ל', 'סיירת מטכל', 'סיירת מטכ״ל',
  'צנחנים',
  'גולני',
  'גבעתי',
  'נחל',
  'קומנדו'
];

/**
 * בדיקה אם השאלה מכילה שם יחידה מיוחדת
 */
function detectSpecialUnit(text: string): string | null {
  const normalized = text.toLowerCase().trim();
  for (const unit of SPECIAL_UNITS) {
    if (normalized.includes(unit.toLowerCase())) {
      return unit;
    }
  }
  return null;
}

/**
 * חיפוש בטבלת knowledge_base לפי שאלת משתמש
 * @param userQuestion - השאלה של המשתמש
 * @returns מערך של 3-6 רשומות רלוונטיות
 */
export async function searchKnowledgeBase(
  userQuestion: string
): Promise<KnowledgeBaseEntry[]> {
  if (!userQuestion || userQuestion.trim().length === 0) {
    return [];
  }

  const searchTerm = userQuestion.trim().toLowerCase();

  // זיהוי יחידה מיוחדת בשאלה
  const detectedUnit = detectSpecialUnit(searchTerm);

  // מילות חיפוש מהשאלה
  const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 2);

  try {
    // שליפת כל הרשומות
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

    // חישוב ציון רלוונטיות לכל רשומה
    const scoredResults = data.map((entry: KnowledgeBaseEntry) => {
      let score = 0;

      // Boost מיוחד ליחידות - אם זוהתה יחידה בשאלה
      if (detectedUnit) {
        const unitLower = detectedUnit.toLowerCase();

        // בדיקה בשאלה
        if (entry.question?.toLowerCase().includes(unitLower)) {
          score += 300; // boost גבוה מאוד
        }

        // בדיקה בתגיות
        if (entry.tags && Array.isArray(entry.tags)) {
          const hasUnitInTags = entry.tags.some((tag: string) =>
            tag?.toLowerCase().includes(unitLower)
          );
          if (hasUnitInTags) {
            score += 250;
          }
        }

        // בדיקה ב-search_text
        if (entry.search_text?.toLowerCase().includes(unitLower)) {
          score += 200;
        }

        // בדיקה ב-subtopic
        if (entry.subtopic?.toLowerCase().includes(unitLower)) {
          score += 280;
        }
      }

      // חיפוש בשאלה הראשית (משקל גבוה)
      if (entry.question?.toLowerCase().includes(searchTerm)) {
        score += 120;
      }

      // חיפוש במילות חיפוש בודדות בשאלה
      searchWords.forEach(word => {
        if (entry.question?.toLowerCase().includes(word)) {
          score += 20;
        }
      });

      // חיפוש בוריאציות השאלה
      if (entry.question_variants && Array.isArray(entry.question_variants)) {
        entry.question_variants.forEach((variant: string) => {
          if (variant?.toLowerCase().includes(searchTerm)) {
            score += 100;
          }
          searchWords.forEach(word => {
            if (variant?.toLowerCase().includes(word)) {
              score += 16;
            }
          });
        });
      }

      // חיפוש ב-user_intents
      if (entry.user_intents && Array.isArray(entry.user_intents)) {
        entry.user_intents.forEach((intent: string) => {
          if (intent?.toLowerCase().includes(searchTerm)) {
            score += 90;
          }
          searchWords.forEach(word => {
            if (intent?.toLowerCase().includes(word)) {
              score += 14;
            }
          });
        });
      }

      // חיפוש בתגיות
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag: string) => {
          if (tag?.toLowerCase().includes(searchTerm)) {
            score += 40;
          }
          searchWords.forEach(word => {
            if (tag?.toLowerCase().includes(word)) {
              score += 6;
            }
          });
        });
      }

      // חיפוש ב-search_text
      if (entry.search_text?.toLowerCase().includes(searchTerm)) {
        score += 20;
      }
      searchWords.forEach(word => {
        if (entry.search_text?.toLowerCase().includes(word)) {
          score += 3;
        }
      });

      return { ...entry, score };
    });

    // סינון רשומות עם ציון מעל 0 ומיון לפי ציון
    const filteredResults = scoredResults
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);

    // החזרת 3-6 התוצאות הטובות ביותר
    const resultsCount = Math.min(Math.max(filteredResults.length, 3), 6);
    return filteredResults.slice(0, resultsCount).map(({ score, ...entry }) => entry);

  } catch (err) {
    console.error('Unexpected error in searchKnowledgeBase:', err);
    return [];
  }
}
