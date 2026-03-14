import { Track } from '../types/tracks';
import { KnowledgeItem } from '../types/guidance';
import { AgentSearchResult } from './agentSearch';
import { suggestedQuestions } from '../data/suggestedQuestions';

export interface BuiltAnswer {
  text: string;
  sources: {
    tracks: Track[];
    guidance: KnowledgeItem[];
  };
}

function buildStructuredGuidanceAnswer(item: KnowledgeItem, userType: 'candidate' | 'parent'): string[] {
  const sections: string[] = [];

  const displayAnswer = userType === 'parent' && item.answer_parent
    ? item.answer_parent
    : item.answer;

  sections.push(displayAnswer);

  if (item.bullets || item.bullets_parent) {
    const displayBullets = userType === 'parent' && item.bullets_parent
      ? item.bullets_parent
      : item.bullets;

    if (displayBullets && displayBullets.length > 0) {
      sections.push('');
      displayBullets.slice(0, 3).forEach(bullet => {
        sections.push(`• ${bullet}`);
      });
    }
  }

  if (item.tip) {
    sections.push('');
    sections.push(`**💡 טיפ:** ${item.tip}`);
  }

  return sections;
}

export function buildAnswer(searchResult: AgentSearchResult, userType: 'candidate' | 'parent' = 'candidate'): BuiltAnswer {
  if (!searchResult.hasResults || searchResult.confidence === 'low') {
    const sections: string[] = [];
    sections.push('לא מצאנו תשובה מספיק מדויקת לשאלה הזו כרגע.');
    sections.push('');
    sections.push('**אפשר לנסח אותה אחרת או לבחור אחת מהשאלות המוצעות:**');
    sections.push('');

    const sampleQuestions = suggestedQuestions
      .flatMap(group => group.questions)
      .slice(0, 3);

    sampleQuestions.forEach(q => {
      sections.push(`• ${q}`);
    });

    return {
      text: sections.join('\n'),
      sources: {
        tracks: [],
        guidance: []
      }
    };
  }

  const sections: string[] = [];

  if (searchResult.guidance.length > 0) {
    const primaryGuidance = searchResult.guidance[0];

    sections.push(...buildStructuredGuidanceAnswer(primaryGuidance, userType));

    if (searchResult.guidance.length > 1) {
      sections.push('');
      sections.push('**נושאים נוספים רלוונטיים:**');
      sections.push('');

      searchResult.guidance.slice(1, 3).forEach((item) => {
        const displayAnswer = userType === 'parent' && item.answer_parent
          ? item.answer_parent
          : item.answer;

        sections.push(`**${item.question}**`);
        sections.push(displayAnswer);
        sections.push('');
      });
    }
  }

  if (searchResult.tracks.length > 0 && searchResult.guidance.length === 0) {
    const primaryTrack = searchResult.tracks[0];
    sections.push(`**${primaryTrack.name}**`);
    sections.push(primaryTrack.summary);

    if (primaryTrack.keywords.length > 0) {
      sections.push('');
      sections.push(`**מאפיינים:** ${primaryTrack.keywords.slice(0, 4).join(', ')}`);
    }

    if (searchResult.tracks.length > 1) {
      sections.push('');
      sections.push('**מסלולים נוספים רלוונטיים:**');
      searchResult.tracks.slice(1, 3).forEach(track => {
        sections.push(`• **${track.name}** - ${track.summary}`);
      });
    }
  }

  if (searchResult.tracks.length > 0 && searchResult.guidance.length > 0) {
    sections.push('');
    sections.push('**מסלולים קשורים:**');
    searchResult.tracks.slice(0, 2).forEach(track => {
      sections.push(`• **${track.name}** - ${track.summary}`);
    });
  }

  return {
    text: sections.join('\n'),
    sources: {
      tracks: searchResult.tracks,
      guidance: searchResult.guidance
    }
  };
}

export function formatAnswerForDisplay(answer: BuiltAnswer): string {
  return answer.text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .trim();
}

export function parseAnswerSections(answerText: string): { type: 'heading' | 'text' | 'bullet'; content: string }[] {
  const lines = answerText.split('\n');
  const sections: { type: 'heading' | 'text' | 'bullet'; content: string }[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.match(/^\*\*(.*?)\*\*$/)) {
      sections.push({
        type: 'heading',
        content: trimmed.replace(/\*\*/g, '')
      });
    } else if (trimmed.startsWith('•') || trimmed.match(/^\d+\./)) {
      sections.push({
        type: 'bullet',
        content: trimmed.replace(/^[•\d.]\s*/, '')
      });
    } else {
      sections.push({
        type: 'text',
        content: trimmed.replace(/\*\*(.*?)\*\*/g, '$1')
      });
    }
  });

  return sections;
}
