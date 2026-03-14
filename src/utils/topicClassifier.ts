import { normalizeHebrewText } from './normalizeQuestion';

export type TopicCategory =
  | 'path_selection'
  | 'interview_prep'
  | 'personal_readiness'
  | 'decision_making'
  | 'first_order'
  | 'physical_prep'
  | 'specific_track'
  | 'general';

interface TopicPattern {
  category: TopicCategory;
  keywords: string[];
  phrases: string[];
}

const TOPIC_PATTERNS: TopicPattern[] = [
  {
    category: 'path_selection',
    keywords: ['בחירת', 'מסלול', 'התאמה', 'מתאים', 'קרבי', 'מודיעין', 'טכני', 'תומך', 'אופי', 'בוחרים', 'להבין', 'התאמה'],
    phrases: ['בחירת מסלול', 'מתאים לי', 'קרבי או מודיעין', 'איזה מסלול', 'מה מתאים', 'מתאים לאופי']
  },
  {
    category: 'interview_prep',
    keywords: ['ראיון', 'יום סיירות', 'מיון', 'מיונים', 'בודקים', 'גיבוש', 'בוחנים', 'בוחן', 'מבחן', 'תהליך'],
    phrases: ['יום סיירות', 'ראיון אישי', 'מה בודקים', 'מה מחפשים', 'תהליך מיון', 'יום מיון', 'גיבוש אימונים']
  },
  {
    category: 'personal_readiness',
    keywords: ['רגוע', 'לחץ', 'להגיע', 'להתמודד', 'להציג', 'מנטלי', 'מנטלית', 'רגשי', 'רגשית', 'חרדה', 'פחד', 'ביטחון'],
    phrases: ['להגיע רגוע', 'להתמודד עם לחץ', 'הכנה מנטלית', 'להציג את עצמי', 'מוכנות נפשית', 'מוכנות אישית']
  },
  {
    category: 'decision_making',
    keywords: ['לבחור', 'החלטה', 'אכזבה', 'ביטחון עצמי', 'בחירה', 'ביטחון', 'להחליט', 'החלטות'],
    phrases: ['לבחור בין', 'קבלת החלטות', 'להתמודד עם אכזבה', 'ביטחון עצמי', 'איך לבחור']
  },
  {
    category: 'first_order',
    keywords: ['צו ראשון', 'צו', 'הגעה', 'חובה', 'להגיע', 'לבוא', 'מועד'],
    phrases: ['צו ראשון', 'חובת הגעה', 'צו מיון', 'להגיע לצו']
  },
  {
    category: 'physical_prep',
    keywords: ['פיזי', 'פיזית', 'כושר', 'ריצה', 'שרירים', 'אימון', 'אימונים', 'התאמנות', 'גופני'],
    phrases: ['הכנה פיזית', 'כושר גופני', 'אימוני כושר', 'הכנה גופנית']
  },
  {
    category: 'specific_track',
    keywords: ['שייטת', 'טיס', 'שחקים', 'סיירת', 'מטכ״ל', 'גאמא', 'חובלים', 'קבא', 'ממרם', 'דובדבן'],
    phrases: ['שייטת 13', 'קורס טיס', 'מסלול שחקים', 'סיירת מטכ״ל', 'גאמ״א']
  }
];

export function classifyQuestionTopic(normalizedQuery: string): TopicCategory[] {
  const lowerQuery = normalizeHebrewText(normalizedQuery);
  const matchedTopics: Set<TopicCategory> = new Set();

  for (const pattern of TOPIC_PATTERNS) {
    for (const phrase of pattern.phrases) {
      if (lowerQuery.includes(phrase.toLowerCase())) {
        matchedTopics.add(pattern.category);
        break;
      }
    }

    if (!matchedTopics.has(pattern.category)) {
      const matchCount = pattern.keywords.filter(keyword =>
        lowerQuery.includes(keyword.toLowerCase())
      ).length;

      if (matchCount >= 2 || (matchCount >= 1 && pattern.keywords.length <= 5)) {
        matchedTopics.add(pattern.category);
      }
    }
  }

  if (matchedTopics.size === 0) {
    return ['general'];
  }

  return Array.from(matchedTopics);
}

export function getTopicTags(category: TopicCategory): string[] {
  switch (category) {
    case 'path_selection':
      return ['בחירת מסלול', 'התאמה אישית', 'קרבי', 'מודיעין', 'החלטות'];
    case 'interview_prep':
      return ['מיונים', 'ראיון', 'יום סיירות', 'גיבוש', 'תהליכים'];
    case 'personal_readiness':
      return ['הכנה מנטלית', 'לחץ', 'מוכנות נפשית', 'ביטחון עצמי'];
    case 'decision_making':
      return ['החלטות', 'בחירה', 'אכזבה', 'ביטחון'];
    case 'first_order':
      return ['צו ראשון', 'מועדים', 'הגעה'];
    case 'physical_prep':
      return ['כושר', 'הכנה פיזית', 'אימונים'];
    case 'specific_track':
      return ['מסלולים', 'יחידות'];
    case 'general':
      return [];
  }
}

export function isTopicRelevant(
  itemTags: string[],
  itemTopic: string,
  questionTopics: TopicCategory[]
): boolean {
  if (questionTopics.includes('general')) {
    return true;
  }

  const normalizedItemTags = itemTags.map(tag => normalizeHebrewText(tag));
  const normalizedItemTopic = normalizeHebrewText(itemTopic);

  for (const questionTopic of questionTopics) {
    const topicTags = getTopicTags(questionTopic).map(tag => normalizeHebrewText(tag));

    for (const topicTag of topicTags) {
      if (normalizedItemTags.some(tag => tag.includes(topicTag) || topicTag.includes(tag))) {
        return true;
      }
      if (normalizedItemTopic.includes(topicTag) || topicTag.includes(normalizedItemTopic)) {
        return true;
      }
    }
  }

  return false;
}
