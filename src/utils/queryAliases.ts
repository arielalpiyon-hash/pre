export interface QueryExpansion {
  original: string;
  variants: string[];
  allTerms: string[];
}

const TERM_ALIASES: Record<string, string[]> = {
  'גאמא': ['גאמ״א', 'גאמ"א', 'גמא', 'גיבוש אימונים', 'גיא'],
  'גאמ״א': ['גאמא', 'גאמ"א', 'גמא', 'גיבוש אימונים'],
  'גאמ"א': ['גאמא', 'גאמ״א', 'גמא', 'גיבוש אימונים'],

  'יום סיירות': ['יום שדה', 'יום סיירות בשטח', 'סיירות'],
  'יום שדה': ['יום סיירות', 'יום סיירות בשטח'],

  'שחקים': ['מסלול שחקים', 'קורס שחקים', 'טיס שחקים'],
  'מסלול שחקים': ['שחקים', 'קורס שחקים'],

  'טיס': ['קורס טיס', 'מסלול טיס', 'טייס', 'טיסה', 'חיל האוויר'],
  'קורס טיס': ['טיס', 'מסלול טיס', 'טייס'],

  'חובלים': ['מסלול חובלים', 'קורס חובלים', 'חובל'],
  'מסלול חובלים': ['חובלים', 'קורס חובלים'],

  'שייטת': ['שייטת 13', 'שיטת', 'קומנדו ים', 'צלילה קרבית'],
  'שייטת 13': ['שייטת', 'קומנדו ים'],

  'מטכ״ל': ['מטכל', 'מטכ"ל', 'מטכ״״ל', 'מטכ"״ל'],
  'מטכל': ['מטכ״ל', 'מטכ"ל'],

  'צה״ל': ['צהל', 'צה"ל', 'צבא', 'צבא הגנה לישראל'],
  'צהל': ['צה״ל', 'צה"ל', 'צבא'],

  'קרבי': ['לוחם', 'קרבית', 'לחימה', 'יחידה קרבית', 'combat'],
  'לוחם': ['קרבי', 'לחימה'],
  'combat': ['קרבי', 'לוחם', 'לחימה'],

  'מודיעין': ['מודיעיני', 'אינטליגנציה', 'intelligence', 'ביון'],
  'intelligence': ['מודיעין', 'מודיעיני', 'ביון'],

  'פרופיל': ['פרופיל רפואי', 'פרופיל בריאות', 'פרופיל 97', 'פרופיל רפואי גבוה'],
  'פרופיל רפואי': ['פרופיל', 'פרופיל בריאות'],

  'דקל': ['מבחן דקל', 'מבחני דקל', 'דקלים'],
  'מבחן דקל': ['דקל', 'מבחני דקל'],

  'קבא': ['קבא״', 'קבא"', 'קציני בטחון אוויר'],
  'קבא״': ['קבא', 'קציני בטחון אוויר'],

  'ממר״ם': ['ממרם', 'ממר"ם', 'מרכז מיון רפואי'],
  'ממרם': ['ממר״ם', 'ממר"ם'],

  'מיונים': ['מיון', 'תהליך מיון', 'יום מיון'],
  'יום מיון': ['מיונים', 'מיון', 'תהליך מיון'],

  'גיוס': ['תהליך גיוס', 'יום גיוס', 'להתגייס'],
  'תהליך גיוס': ['גיוס', 'יום גיוס'],

  'בא״ח': ['באח', 'בא"ח', 'בסיס אישי חייל'],
  'באח': ['בא״ח', 'בא"ח'],

  'בחירת מסלול': ['בחירה', 'מה מתאים', 'איזה מסלול', 'התאמה', 'מתאים לי'],
  'מתאים לי': ['התאמה', 'בחירת מסלול', 'מה מתאים'],
  'התאמה': ['מתאים', 'התאמה אישית', 'בחירת מסלול'],

  'ראיון': ['ראיון אישי', 'interview', 'שיחה'],
  'interview': ['ראיון', 'ראיון אישי'],

  'צו ראשון': ['צו', 'first order', 'הזמנה למיון'],
  'first order': ['צו ראשון', 'צו'],

  'הכנה מנטלית': ['מוכנות נפשית', 'הכנה נפשית', 'מנטלי'],
  'לחץ': ['סטרס', 'stress', 'מתח'],
  'stress': ['לחץ', 'סטרס', 'מתח'],

  'כושר': ['כושר גופני', 'פיזי', 'הכנה פיזית'],
  'פיזי': ['כושר', 'גופני', 'הכנה פיזית'],
};

export function expandQuery(normalizedQuery: string): QueryExpansion {
  const lowerQuery = normalizedQuery.toLowerCase();
  const variants: string[] = [normalizedQuery, lowerQuery];
  const allTerms: Set<string> = new Set([normalizedQuery, lowerQuery]);

  for (const [term, aliases] of Object.entries(TERM_ALIASES)) {
    if (lowerQuery.includes(term.toLowerCase())) {
      aliases.forEach(alias => {
        variants.push(alias);
        allTerms.add(alias.toLowerCase());
      });
    }
  }

  const words = lowerQuery.split(/\s+/);
  words.forEach(word => {
    if (word.length > 2) {
      allTerms.add(word);

      for (const [term, aliases] of Object.entries(TERM_ALIASES)) {
        if (term.toLowerCase() === word || term.toLowerCase().includes(word)) {
          aliases.forEach(alias => {
            allTerms.add(alias.toLowerCase());
          });
        }
      }
    }
  });

  return {
    original: normalizedQuery,
    variants: Array.from(new Set(variants)),
    allTerms: Array.from(allTerms)
  };
}

export function hasExactMatch(text: string, searchTerms: string[]): boolean {
  const lowerText = text.toLowerCase();
  return searchTerms.some(term => {
    const lowerTerm = term.toLowerCase();
    return lowerText === lowerTerm;
  });
}

export function hasPartialMatch(text: string, searchTerms: string[]): boolean {
  const lowerText = text.toLowerCase();
  return searchTerms.some(term => lowerText.includes(term.toLowerCase()));
}

export function hasPhraseMatch(text: string, phrase: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  return lowerText.includes(lowerPhrase);
}

export function countTokenMatches(text: string, tokens: string[]): number {
  const lowerText = text.toLowerCase();
  return tokens.filter(token => lowerText.includes(token)).length;
}

export function countPhraseMatches(text: string, phrases: string[]): number {
  const lowerText = text.toLowerCase();
  return phrases.filter(phrase => lowerText.includes(phrase.toLowerCase())).length;
}
