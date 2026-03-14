export interface KnowledgeItem {
  id: string;
  type: 'faq' | 'concept' | 'guide' | 'template';
  topic: string;
  subtopic: string;
  question: string;
  question_variants: string[];
  answer: string;
  answer_parent?: string;
  bullets: string[];
  bullets_parent?: string[];
  audience: string;
  stage: string[];
  tags: string[];
  source_files: string[];
  search_text: string;
  tips?: string[];
  tips_parent?: string[];
  actions?: string[];
  actions_parent?: string[];
}

export interface GuidanceTip {
  id: string;
  title: string;
  content: string;
  category: 'mental' | 'physical' | 'interview' | 'screening' | 'general';
  tags: string[];
  relevantStages?: string[];
  relevantTracks?: string[];
  priority: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export interface PreparationGuide {
  id: string;
  stage: string;
  title: string;
  description: string;
  steps: string[];
  tips: string[];
}

export interface GuidanceSearchFilters {
  category?: 'mental' | 'physical' | 'interview' | 'screening' | 'general';
  searchQuery?: string;
  tags?: string[];
  relevantStage?: string;
  type?: 'faq' | 'concept' | 'guide' | 'template';
  topic?: string;
}
