import { KnowledgeItem, GuidanceSearchFilters } from '../types/guidance';
import { knowledgeBase } from '../data/guidanceKnowledgeBase';

export function searchKnowledge(filters: GuidanceSearchFilters): KnowledgeItem[] {
  let results = [...knowledgeBase];

  if (filters.type) {
    results = results.filter(item => item.type === filters.type);
  }

  if (filters.topic) {
    results = results.filter(item => item.topic === filters.topic);
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(item =>
      item.question.toLowerCase().includes(query) ||
      item.question_variants.some(variant => variant.toLowerCase().includes(query)) ||
      item.answer.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query)) ||
      item.search_text.toLowerCase().includes(query)
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(item =>
      filters.tags!.some(tag => item.tags.includes(tag))
    );
  }

  if (filters.relevantStage) {
    results = results.filter(item =>
      item.stage.includes(filters.relevantStage!) || item.audience === filters.relevantStage
    );
  }

  return results;
}

export function getKnowledgeById(id: string): KnowledgeItem | undefined {
  return knowledgeBase.find(item => item.id === id);
}

export function getKnowledgeByTopic(topic: string): KnowledgeItem[] {
  return knowledgeBase.filter(item => item.topic === topic);
}

export function getKnowledgeByAudience(audience: string): KnowledgeItem[] {
  return knowledgeBase.filter(item => item.audience === audience);
}

export function getAllTopics(): string[] {
  const topics = new Set(knowledgeBase.map(item => item.topic));
  return Array.from(topics);
}

export function getAllTags(): string[] {
  const tags = new Set(knowledgeBase.flatMap(item => item.tags));
  return Array.from(tags);
}

export interface SimpleSearchResult {
  item: KnowledgeItem;
  score: number;
}

export function searchGuidance(query: string): SimpleSearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  const results: SimpleSearchResult[] = [];

  for (const item of knowledgeBase) {
    let score = 0;

    if (item.question.toLowerCase().includes(normalizedQuery)) {
      score += 100;
    }

    for (const variant of item.question_variants) {
      if (variant.toLowerCase().includes(normalizedQuery)) {
        score += 80;
        break;
      }
    }

    if (item.search_text.toLowerCase().includes(normalizedQuery)) {
      score += 30;
    }

    for (const tag of item.tags) {
      if (tag.toLowerCase().includes(normalizedQuery)) {
        score += 50;
      }
    }

    if (item.answer.toLowerCase().includes(normalizedQuery)) {
      score += 20;
    }

    if (score > 0) {
      results.push({ item, score });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
