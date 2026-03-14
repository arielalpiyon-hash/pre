export interface Track {
  id: string;
  name: string;
  kind: 'screening_gate' | 'track' | 'role_family' | 'role';
  category: string;
  entryType: 'screening' | 'assignment';
  summary: string;
  audience: string[];
  gender: string[];
  profileMin?: number;
  requirements?: string[];
  process?: string[];
  keywords: string[];
  ui: {
    homeGroup: string;
    cardTitle: string;
    cardSubtitle: string;
    ctaLabel: string;
    detailsScreen: string;
    badge: string;
    searchWeight: number;
  };
  sources: Array<{
    url: string;
    title: string;
    snippet: string;
  }>;
  verify: {
    confidence: 'high' | 'medium' | 'low';
    verifiedAt: string;
    hasConflict: boolean;
  };
}

export interface FilterCategory {
  id: string;
  label: string;
}

export interface FilterEntryType {
  id: string;
  label: string;
}

export interface FilterKind {
  id: string;
  label: string;
}

export interface TracksData {
  meta: {
    version: number;
    lang: string;
    generatedAt: string;
    sourceType: string;
  };
  filters: {
    categories: FilterCategory[];
    entryTypes: FilterEntryType[];
    kinds: FilterKind[];
  };
  tracks: Track[];
}

export interface TrackSearchFilters {
  category?: string;
  entryType?: string;
  kind?: string;
  searchQuery?: string;
  profileMin?: number;
  gender?: string;
}
