import { ConversationContext, UserProfile } from '../types/conversation';

export interface QuestionRule {
  topic: string;
  condition: (profile: UserProfile) => boolean;
  question: string;
}

const guidedQuestions: QuestionRule[] = [
  {
    topic: 'יחידות מיוחדות',
    condition: (profile) => profile.hasAttendedScoutDay === undefined,
    question: 'עשית כבר יום סיירות או שאתה עוד לפני צו ראשון?',
  },
  {
    topic: 'יחידות מיוחדות',
    condition: (profile) => profile.hasAttendedScoutDay === true && profile.hasAttendedGibush === undefined,
    question: 'קיבלת זימון לגיבוש אחרי יום הסיירות?',
  },
  {
    topic: 'יחידות מיוחדות',
    condition: (profile) => profile.profileLevel === undefined,
    question: 'יש לך מושג איזה פרופיל רפואי יש לך?',
  },
  {
    topic: 'יום סיירות',
    condition: (profile) => profile.hasAttendedScoutDay === undefined,
    question: 'כבר קיבלת זימון ליום סיירות?',
  },
  {
    topic: 'יום סיירות',
    condition: (profile) => profile.hasAttendedScoutDay === false && !profile.strengths?.length,
    question: 'איך אתה מרגיש מבחינה כושר גופני - חזק או צריך עוד הכנה?',
  },
  {
    topic: 'גיבושים',
    condition: (profile) => profile.hasAttendedGibush === undefined,
    question: 'כבר עברת גיבוש או שזה משהו שאתה מתכונן אליו?',
  },
  {
    topic: 'גיבושים',
    condition: (profile) => !profile.interestedUnits?.length,
    question: 'יש יחידה ספציפית שמעניינת אותך?',
  },
  {
    topic: 'מיונים לצבא',
    condition: (profile) => profile.stage === undefined,
    question: 'באיזה שלב אתה - לפני צו ראשון, אחרי צו ראשון, או כבר בתהליך מיונים?',
  },
  {
    topic: 'מיונים לצבא',
    condition: (profile) => !profile.strengths?.length,
    question: 'במה אתה טוב - יותר פיזי, טכנולוגי, או אולי מנהיגות?',
  },
  {
    topic: 'התאמה אישית לצבא',
    condition: () => true,
    question: 'מה חשוב לך בשירות הצבאי - אתגר פיזי, תרומה משמעותית, או אולי פיתוח מקצועי?',
  },
  {
    topic: 'התפתחות אישית לפני צבא',
    condition: (profile) => profile.concerns === undefined || profile.concerns.length === 0,
    question: 'יש משהו שמדאיג אותך או שאתה רוצה להיות בטוח בו לפני הגיוס?',
  },
];

export function selectFollowUpQuestion(
  topic: string,
  context: ConversationContext
): string | null {
  const relevantQuestions = guidedQuestions.filter(
    (rule) => rule.topic === topic && rule.condition(context.userProfile)
  );

  if (relevantQuestions.length === 0) {
    return getGenericFollowUp(topic);
  }

  return relevantQuestions[0].question;
}

function getGenericFollowUp(topic: string): string {
  const genericQuestions: Record<string, string> = {
    'יחידות מיוחדות': 'רוצה לדעת עוד על יחידה ספציפית או על התהליך באופן כללי?',
    'יום סיירות': 'רוצה טיפים איך להתכונן או מידע על מה קורה שם?',
    'גיבושים': 'רוצה לדעת איך להתנהג בגיבוש או מה בודקים?',
    'מיונים לצבא': 'רוצה עזרה לבחור בין מיונים או טיפים איך להצליח?',
    'התאמה אישית לצבא': 'רוצה לדבר על מה מתאים לך או על סוגי תפקידים?',
    'התפתחות אישית לפני צבא': 'רוצה לדבר על איך להתכונן מנטלית או פיזית?',
  };

  return genericQuestions[topic] || 'יש עוד משהו שתרצה לדעת?';
}

export function generateConversationPrompt(topic: string): string {
  const prompts: Record<string, string> = {
    'יחידות מיוחדות': 'אם תרצה, אפשר להמשיך לדבר ולהבין בדיוק איזה יחידה מתאימה לך.',
    'יום סיירות': 'אם תרצה להמשיך, אני יכול לעזור לך להתכונן בצורה הכי טובה.',
    'גיבושים': 'אם תספר לי עוד קצת, אוכל לתת לך טיפים ממוקדים לגיבוש שאתה מכוון אליו.',
    'מיונים לצבא': 'אם תספר לי מה חשוב לך, אוכל לעזור לך למצוא את המסלול שמתאים.',
    'התאמה אישית לצבא': 'בואו נדבר קצת כדי להבין מה באמת מתאים לך.',
    'התפתחות אישית לפני צבא': 'אם תרצה, אפשר לדבר על איך להכין את עצמך בצורה הנכונה.',
  };

  return prompts[topic] || 'בואו נמשיך לדבר כדי למצוא את הדרך שמתאימה לך.';
}
