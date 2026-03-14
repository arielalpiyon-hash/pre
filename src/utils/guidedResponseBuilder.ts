import { GuidedResponse } from '../types/conversation';
import { ConversationContext } from '../types/conversation';
import { selectFollowUpQuestion, generateConversationPrompt } from './guidedQuestions';

function inferTopicFromQuestion(question: string): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('שלדג') || lowerQuestion.includes('מטכל') ||
      lowerQuestion.includes('669') || lowerQuestion.includes('שייטת') ||
      lowerQuestion.includes('מגלן') || lowerQuestion.includes('דובדבן') ||
      lowerQuestion.includes('יהלם') || lowerQuestion.includes('אגוז') ||
      lowerQuestion.includes('קומנדו')) {
    return 'יחידות מיוחדות';
  }

  if (lowerQuestion.includes('יום סיירות') || lowerQuestion.includes('סיירות')) {
    return 'יום סיירות';
  }

  if (lowerQuestion.includes('גיבוש')) {
    return 'גיבושים';
  }

  if (lowerQuestion.includes('מיון') || lowerQuestion.includes('תפקיד') ||
      lowerQuestion.includes('זימון')) {
    return 'מיונים לצבא';
  }

  if (lowerQuestion.includes('מתאים') || lowerQuestion.includes('התאמה')) {
    return 'התאמה אישית לצבא';
  }

  if (lowerQuestion.includes('להתכונן') || lowerQuestion.includes('פחד') ||
      lowerQuestion.includes('ביטחון עצמי') || lowerQuestion.includes('מנטלי')) {
    return 'התפתחות אישית לפני צבא';
  }

  return 'מיונים לצבא';
}

export function buildGuidedResponse(
  answer: string,
  question: string,
  context: ConversationContext
): GuidedResponse {
  const topic = inferTopicFromQuestion(question);

  const followUpQuestion = selectFollowUpQuestion(topic, context);
  const conversationPrompt = generateConversationPrompt(topic);

  const shortAnswer = makeAnswerConcise(answer);

  return {
    answer: shortAnswer,
    followUpQuestion: followUpQuestion || '',
    conversationPrompt,
  };
}

function makeAnswerConcise(answer: string): string {
  if (!answer) return '';

  const sentences = answer.split(/[.!?]\s+/);

  if (sentences.length <= 2) {
    return answer;
  }

  return sentences.slice(0, 2).join('. ') + '.';
}

export function formatGuidedMessage(response: GuidedResponse): string {
  const parts = [response.answer];

  if (response.followUpQuestion) {
    parts.push('');
    parts.push(response.followUpQuestion);
  }

  if (response.conversationPrompt) {
    parts.push('');
    parts.push(response.conversationPrompt);
  }

  return parts.join('\n');
}
