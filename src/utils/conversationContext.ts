import { ConversationContext, UserProfile, CONTEXT_KEYWORDS } from '../types/conversation';

export function createInitialContext(): ConversationContext {
  return {
    userId: generateUserId(),
    messagesHistory: [],
    userProfile: {
      did_tzav_rishon: null,
      did_yom_sayarot: null,
      did_get_gibush: null
    },
  };
}

export function updateUserProfile(
  context: ConversationContext,
  updates: Partial<UserProfile>
): ConversationContext {
  return {
    ...context,
    userProfile: {
      ...context.userProfile,
      ...updates,
    },
  };
}

export function extractUserContext(
  question: string,
  context: ConversationContext
): Partial<UserProfile> {
  const updates: Partial<UserProfile> = {};
  const lowerQuestion = question.toLowerCase();

  if (CONTEXT_KEYWORDS.tzav_rishon_yes.some(keyword => lowerQuestion.includes(keyword))) {
    updates.did_tzav_rishon = true;
  }

  if (CONTEXT_KEYWORDS.tzav_rishon_no.some(keyword => lowerQuestion.includes(keyword))) {
    updates.did_tzav_rishon = false;
  }

  if (CONTEXT_KEYWORDS.yom_sayarot_yes.some(keyword => lowerQuestion.includes(keyword))) {
    updates.did_yom_sayarot = true;
  }

  if (CONTEXT_KEYWORDS.yom_sayarot_no.some(keyword => lowerQuestion.includes(keyword))) {
    updates.did_yom_sayarot = false;
  }

  if (CONTEXT_KEYWORDS.gibush_yes.some(keyword => lowerQuestion.includes(keyword))) {
    updates.did_get_gibush = true;
  }

  if (CONTEXT_KEYWORDS.gibush_no.some(keyword => lowerQuestion.includes(keyword))) {
    updates.did_get_gibush = false;
  }

  const units = ['שלדג', 'מטכל', '669', 'שייטת', 'מגלן', 'דובדבן', 'יהלם', 'אגוז', 'עוקץ', 'גולני', 'צנחנים', 'גבעתי', 'נחל', '8200'];
  units.forEach(unit => {
    if (lowerQuestion.includes(unit)) {
      if (!updates.interestedUnits) {
        updates.interestedUnits = context.userProfile.interestedUnits || [];
      }
      if (!updates.interestedUnits.includes(unit)) {
        updates.interestedUnits.push(unit);
      }
    }
  });

  return updates;
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function adaptAnswerToContext(answer: string, profile: UserProfile, question: string): string {
  const lowerQuestion = question.toLowerCase();

  if (profile.did_yom_sayarot === true) {
    const lines = answer.split('\n');
    const filteredLines = lines.filter(line => {
      const lowerLine = line.toLowerCase();
      return !(
        (lowerLine.includes('להתכונן ליום סיירות') ||
         lowerLine.includes('לפני יום סיירות') ||
         (lowerLine.includes('יום סיירות') && lowerLine.includes('צריך לעבור')))
      );
    });

    answer = filteredLines.join('\n').trim();

    if (lowerQuestion.includes('איך מגיעים') || lowerQuestion.includes('שלדג') || lowerQuestion.includes('מטכל') || lowerQuestion.includes('שייטת')) {
      return `אם כבר עשית יום סיירות, השלב הבא בדרך כלל תלוי בתוצאות שקיבלת ובזימונים להמשך.\n\n${answer}`;
    }
  }

  if (profile.did_get_gibush === true) {
    if (lowerQuestion.includes('איך מגיעים') || lowerQuestion.includes('שלדג') || lowerQuestion.includes('מטכל') || lowerQuestion.includes('שייטת')) {
      return `אם כבר קיבלת גיבוש, הפוקוס עכשיו צריך להיות על הכנה נכונה לגיבוש ועל הבנה של מה בודקים שם.\n\n${answer}`;
    }
  }

  if (profile.did_tzav_rishon === false) {
    if (lowerQuestion.includes('איך מתחילים') || lowerQuestion.includes('מה השלבים') || lowerQuestion.includes('איך זה עובד')) {
      return `השלבים הראשונים מתחילים בצו ראשון.\n\n${answer}`;
    }
  }

  return answer;
}

export function getNextFollowUpQuestion(profile: UserProfile, question: string): string | null {
  const lowerQuestion = question.toLowerCase();

  const isAboutMilitary = lowerQuestion.includes('צבא') ||
                         lowerQuestion.includes('מיון') ||
                         lowerQuestion.includes('יחידה') ||
                         lowerQuestion.includes('שלדג') ||
                         lowerQuestion.includes('מטכל') ||
                         lowerQuestion.includes('שייטת') ||
                         lowerQuestion.includes('גיבוש') ||
                         lowerQuestion.includes('סיירות');

  if (!isAboutMilitary) {
    return null;
  }

  if (profile.did_tzav_rishon === null) {
    return 'כבר עשית צו ראשון?';
  }

  if (profile.did_yom_sayarot === null) {
    return 'כבר עשית יום סיירות?';
  }

  if (profile.did_get_gibush === null && profile.did_yom_sayarot === true) {
    return 'כבר קיבלת גיבוש?';
  }

  return null;
}

export function createConversationSummary(context: ConversationContext): string {
  const parts: string[] = [];

  if (context.userProfile.did_tzav_rishon === true) {
    parts.push('עבר צו ראשון');
  } else if (context.userProfile.did_tzav_rishon === false) {
    parts.push('עדיין לא עבר צו ראשון');
  }

  if (context.userProfile.did_yom_sayarot === true) {
    parts.push('עבר יום סיירות');
  } else if (context.userProfile.did_yom_sayarot === false) {
    parts.push('לא עבר יום סיירות');
  }

  if (context.userProfile.did_get_gibush === true) {
    parts.push('קיבל גיבוש');
  } else if (context.userProfile.did_get_gibush === false) {
    parts.push('לא קיבל גיבוש');
  }

  if (context.userProfile.interestedUnits && context.userProfile.interestedUnits.length > 0) {
    parts.push(`מעוניין ב: ${context.userProfile.interestedUnits.join(', ')}`);
  }

  return parts.length > 0 ? `[הקשר: ${parts.join(', ')}]` : '';
}
