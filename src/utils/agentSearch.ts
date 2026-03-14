import { normalizeQuestion } from './normalizeQuestion';
import { searchKnowledgeBase, type KnowledgeBaseEntry } from './knowledgeBaseSearch';
import { searchTracksSimple } from './trackSearch';
import { enrichAnswerWithUnitInfo } from './unitEnricher';
import { adaptAnswerToContext } from './conversationContext';
import type { Track } from '../types/tracks';
import type { UserProfile } from '../types/conversation';

const MINIMUM_TRACK_SCORE = 40;

export interface SearchResult {
  item: KnowledgeBaseEntry | Track;
  score: number;
  type: 'knowledge' | 'track';
}

function buildAnswerFromKnowledgeBase(entries: KnowledgeBaseEntry[]): string {
  if (entries.length === 0) return '';

  const sections: string[] = [];
  const primary = entries[0];

  sections.push(primary.answer);

  if (entries.length > 1) {
    sections.push('');
    sections.push('**מידע נוסף רלוונטי:**');
    entries.slice(1, 3).forEach(entry => {
      sections.push(`• ${entry.question}`);
    });
  }

  return sections.join('\n');
}

function buildAnswerWithTracks(knowledgeAnswer: string, tracks: Track[]): string {
  const sections: string[] = [];

  if (knowledgeAnswer) {
    sections.push(knowledgeAnswer);
  }

  if (tracks.length > 0) {
    sections.push('');
    sections.push('**מסלולים רלוונטיים:**');
    tracks.slice(0, 3).forEach(track => {
      sections.push(`• **${track.name}** - ${track.summary}`);
    });
  }

  return sections.join('\n');
}

export async function searchWithAgent(
  question: string,
  persona: 'candidate' | 'parent',
  userProfile?: UserProfile
): Promise<string> {
  console.log('🔍 searchWithAgent called with:', { question, persona, userProfile });

  const normalizedQuestion = normalizeQuestion(question);
  console.log('📝 Normalized question:', normalizedQuestion);

  const knowledgeResults = await searchKnowledgeBase(question);
  console.log('📚 Knowledge base results:', knowledgeResults.length, 'entries');

  const trackResults = searchTracksSimple(normalizedQuestion);
  console.log('🎯 Track results:', trackResults.length, 'tracks');

  if (knowledgeResults.length > 0) {
    const knowledgeAnswer = buildAnswerFromKnowledgeBase(knowledgeResults);
    const relevantTracks = trackResults.filter(r => r.score >= MINIMUM_TRACK_SCORE).map(r => r.item);

    let finalAnswer: string;
    if (relevantTracks.length > 0) {
      finalAnswer = buildAnswerWithTracks(knowledgeAnswer, relevantTracks);
    } else {
      finalAnswer = knowledgeAnswer;
    }

    const enrichedAnswer = enrichAnswerWithUnitInfo(finalAnswer, question);

    if (userProfile) {
      return adaptAnswerToContext(enrichedAnswer, userProfile, question);
    }

    return enrichedAnswer;
  }

  const relevantTracks = trackResults.filter(r => r.score >= MINIMUM_TRACK_SCORE).map(r => r.item);
  if (relevantTracks.length > 0) {
    const sections: string[] = [];
    sections.push('**מסלולים רלוונטיים:**');
    relevantTracks.slice(0, 3).forEach(track => {
      sections.push(`• **${track.name}** - ${track.summary}`);
    });
    const tracksAnswer = sections.join('\n');
    const enrichedAnswer = enrichAnswerWithUnitInfo(tracksAnswer, question);

    if (userProfile) {
      return adaptAnswerToContext(enrichedAnswer, userProfile, question);
    }

    return enrichedAnswer;
  }

  console.log('⚠️ No results found, returning fallback message');
  return persona === 'parent'
    ? 'מצטערים, לא מצאנו מידע ספציפי על נושא זה. מומלץ לפנות ישירות למרכז הקצינים או ליחידה הרלוונטית לקבלת מידע מדויק ועדכני.'
    : 'מצטערים, לא מצאנו מידע ספציפי על נושא זה. מומלץ לפנות למדריכים בבית הגיוס או לבדוק באתר צה"ל הרשמי לקבלת מידע מדויק ועדכני.';
}
