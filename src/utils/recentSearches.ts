
const RECENT_SEARCHES_KEY = 'recent_news_searches';
const MAX_RECENT_SEARCHES = 5;

export const saveRecentSearch = (query: string): void => {
  if (!query.trim()) return;
  
  const existing = getRecentSearches();
  const filtered = existing.filter(search => search.toLowerCase() !== query.toLowerCase());
  const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};

export const getRecentSearches = (): string[] => {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearRecentSearches = (): void => {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
};
