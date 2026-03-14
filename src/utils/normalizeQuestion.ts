const QUESTION_FILLERS = [
  'מה זה',
  'מה זו',
  'מהו',
  'מהי',
  'מי זה',
  'מי זו',
  'איך',
  'למה',
  'מדוע',
  'האם',
  'אפשר',
  'תסביר',
  'תסביר לי',
  'תגיד',
  'תגיד לי',
  'תגידו',
  'ספר',
  'ספר לי',
  'אני רוצה לדעת',
  'רוצה לדעת',
  'יש לי שאלה על',
  'שאלה על',
  'מה זה אומר',
  'מה המשמעות של',
  'מה ההבדל בין',
  'מה ההבדלים בין',
  'איזה',
  'איזו',
  'אילו',
  'מתי',
  'איפה',
  'לאן',
];

const HEBREW_STOPWORDS = [
  'איך',
  'מה',
  'מהו',
  'מהי',
  'האם',
  'אפשר',
  'רוצה',
  'לדעת',
  'להבין',
  'תגיד',
  'תסביר',
  'יש',
  'על',
  'את',
  'של',
  'אל',
  'עם',
  'או',
  'גם',
  'זה',
  'זו',
  'כל',
  'אני',
  'לי',
  'ספר',
  'תגידו',
  'שאלה',
  'אומר',
  'משמעות',
  'הבדל',
  'הבדלים',
  'איזה',
  'איזו',
  'אילו',
  'מתי',
  'איפה',
  'לאן',
];

export function normalizeQuestion(question: string): string {
  let normalized = question.trim();

  normalized = normalized.replace(/[?.!,;:\u05F3\u05F4״׳]/g, ' ');

  normalized = normalized.replace(/\s+/g, ' ').trim();

  const lowerNormalized = normalized.toLowerCase();

  for (const filler of QUESTION_FILLERS) {
    const fillerPattern = new RegExp(`^${filler}\\s+`, 'i');
    if (lowerNormalized.match(fillerPattern)) {
      normalized = normalized.replace(fillerPattern, '');
      break;
    }
  }

  for (const filler of ['על', 'ל', 'את', 'של']) {
    const fillerPattern = new RegExp(`^${filler}\\s+`, 'i');
    normalized = normalized.replace(fillerPattern, '');
  }

  normalized = normalized.trim();

  return normalized;
}

export function tokenizeQuery(query: string): string[] {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter(token => token.length > 1);

  return tokens.filter(token => !HEBREW_STOPWORDS.includes(token));
}

export function normalizeHebrewText(text: string): string {
  return text
    .replace(/[?.!,;:\u05F3\u05F4״׳]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

export function extractMeaningfulTokens(query: string): string[] {
  const tokens = tokenizeQuery(query);
  return tokens.filter(token => token.length >= 3);
}
