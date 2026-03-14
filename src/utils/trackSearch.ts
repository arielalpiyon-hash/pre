import { Track, TrackSearchFilters } from '../types/tracks';
import { tracks } from '../data/tracksData';

export function searchTracks(filters: TrackSearchFilters): Track[] {
  let results = [...tracks];

  if (filters.category) {
    results = results.filter(track => track.category === filters.category);
  }

  if (filters.entryType) {
    results = results.filter(track => track.entryType === filters.entryType);
  }

  if (filters.kind) {
    results = results.filter(track => track.kind === filters.kind);
  }

  if (filters.gender) {
    results = results.filter(track => track.gender.includes(filters.gender!));
  }

  if (filters.profileMin) {
    results = results.filter(track =>
      track.profileMin ? track.profileMin <= filters.profileMin! : true
    );
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(track =>
      track.name.toLowerCase().includes(query) ||
      track.summary.toLowerCase().includes(query) ||
      track.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
      track.ui.cardTitle.toLowerCase().includes(query) ||
      track.ui.cardSubtitle.toLowerCase().includes(query)
    );
  }

  results.sort((a, b) => b.ui.searchWeight - a.ui.searchWeight);

  return results;
}

export function getTrackById(id: string): Track | undefined {
  return tracks.find(track => track.id === id);
}

export function getTracksByHomeGroup(group: string): Track[] {
  return tracks.filter(track => track.ui.homeGroup === group);
}

export function getPopularTracks(): Track[] {
  return getTracksByHomeGroup('popular');
}

export function getAllTracks(): Track[] {
  return tracks;
}

export interface SimpleTrackSearchResult {
  item: Track;
  score: number;
}

export function searchTracksSimple(query: string): SimpleTrackSearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  const results: SimpleTrackSearchResult[] = [];

  for (const track of tracks) {
    let score = 0;

    if (track.name.toLowerCase().includes(normalizedQuery)) {
      score += 100;
    }

    if (track.summary.toLowerCase().includes(normalizedQuery)) {
      score += 50;
    }

    for (const keyword of track.keywords) {
      if (keyword.toLowerCase().includes(normalizedQuery)) {
        score += 70;
      }
    }

    if (track.ui.cardTitle.toLowerCase().includes(normalizedQuery)) {
      score += 80;
    }

    if (track.ui.cardSubtitle.toLowerCase().includes(normalizedQuery)) {
      score += 40;
    }

    if (score > 0) {
      results.push({ item: track, score });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
