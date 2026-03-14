export interface ConversationContext {
  userId: string;
  messagesHistory: ConversationMessage[];
  userProfile: UserProfile;
  currentTopic?: string;
  lastQuestion?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  did_tzav_rishon?: boolean | null;
  did_yom_sayarot?: boolean | null;
  did_get_gibush?: boolean | null;
  profileLevel?: string;
  interestedUnits?: string[];
  strengths?: string[];
  concerns?: string[];
}

export const CONTEXT_KEYWORDS = {
  tzav_rishon_yes: [
    'עשיתי צו ראשון',
    'עברתי צו ראשון',
    'הייתי בצו ראשון',
    'סיימתי צו ראשון',
    'אחרי צו ראשון'
  ],
  tzav_rishon_no: [
    'עוד לא עשיתי צו ראשון',
    'לא עשיתי צו ראשון',
    'עדיין לא הייתי בצו ראשון',
    'לא הייתי בצו ראשון'
  ],
  yom_sayarot_yes: [
    'עשיתי יום סיירות',
    'עברתי יום סיירות',
    'הייתי ביום סיירות',
    'סיימתי יום סיירות',
    'אחרי יום סיירות'
  ],
  yom_sayarot_no: [
    'עוד לא עשיתי יום סיירות',
    'לא עשיתי יום סיירות',
    'עדיין לא הייתי ביום סיירות',
    'לא הייתי ביום סיירות',
    'נפלתי ביום סיירות',
    'לא עברתי יום סיירות'
  ],
  gibush_yes: [
    'קיבלתי גיבוש',
    'יש לי גיבוש',
    'הגיע לי גיבוש',
    'קיבלתי זימון לגיבוש',
    'זימנו אותי לגיבוש'
  ],
  gibush_no: [
    'לא קיבלתי גיבוש',
    'עוד לא קיבלתי גיבוש',
    'עדיין לא קיבלתי גיבוש',
    'אין לי גיבוש'
  ]
};

export interface GuidedResponse {
  answer: string;
  followUpQuestion: string;
  conversationPrompt: string;
}
