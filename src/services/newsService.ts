import { apiCache } from '@/utils/apiCache';

const GNEWS_API_KEYS = [
  'fe777c2cfdf243f6e1c4f400c397a7ad',
  '624fbad2d8a96915c2a76a907169c4fe'
];

let currentKeyIndex = 0;

const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

// Function to normalize category names for GNews API
const normalizeCategoryForAPI = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'general': 'general',
    'nation': 'nation',
    'politics': 'politics',
    'business': 'business',
    'technology': 'technology',
    'entertainment': 'entertainment',
    'sports': 'sports',
    'science': 'science',
    'health': 'health',
    'world': 'world'
  };
  
  return categoryMap[category] || 'general';
};

// Function to get current API key
const getCurrentApiKey = (): string => {
  return GNEWS_API_KEYS[currentKeyIndex];
};

// Function to switch to next API key
const switchToNextApiKey = (): void => {
  currentKeyIndex = (currentKeyIndex + 1) % GNEWS_API_KEYS.length;
  console.log(`Switched to API key ${currentKeyIndex + 1}`);
};

// Function to check if response indicates rate limit
const isRateLimited = (response: Response): boolean => {
  return response.status === 429 || response.status === 403;
};

// Generic fetch function with automatic key switching
const fetchWithKeyRotation = async (url: string): Promise<Response> => {
  let lastError: Error | null = null;
  
  // Try all available keys
  for (let attempt = 0; attempt < GNEWS_API_KEYS.length; attempt++) {
    try {
      const apiKey = getCurrentApiKey();
      const fullUrl = `${url}&token=${apiKey}`;
      
      console.log(`Making request with API key ${currentKeyIndex + 1}`);
      const response = await fetch(fullUrl);
      
      if (isRateLimited(response)) {
        console.log(`API key ${currentKeyIndex + 1} rate limited, switching keys`);
        switchToNextApiKey();
        continue;
      }
      
      if (response.ok) {
        return response;
      }
      
      throw new Error(`API request failed with status: ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      console.error(`Error with API key ${currentKeyIndex + 1}:`, error);
      switchToNextApiKey();
    }
  }
  
  throw lastError || new Error('All API keys failed');
};

// Input validation functions
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  // Remove potentially harmful HTML tags and scripts
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
             .replace(/<[^>]*>/g, '')
             .trim();
};

const validateArticle = (article: any): NewsArticle | null => {
  if (!article || typeof article !== 'object') return null;
  
  // Validate required fields
  if (!article.title || !article.url) return null;
  
  // Validate URLs
  if (!isValidUrl(article.url)) return null;
  if (article.image && !isValidUrl(article.image)) {
    article.image = '';
  }
  if (article.source?.url && !isValidUrl(article.source.url)) {
    article.source.url = '';
  }
  
  return {
    title: sanitizeText(article.title),
    description: sanitizeText(article.description || ''),
    content: sanitizeText(article.content || ''),
    url: article.url,
    image: article.image || '',
    publishedAt: article.publishedAt || new Date().toISOString(),
    source: {
      name: sanitizeText(article.source?.name || 'Unknown'),
      url: article.source?.url || ''
    }
  };
};

export const fetchTopHeadlines = async (country: string = 'us', lang: string = 'en', page: number = 1): Promise<NewsResponse> => {
  const cacheKey = `top-headlines-${country}-${lang}-${page}`;
  
  // Check cache first
  const cachedData = apiCache.get<NewsResponse>(cacheKey);
  if (cachedData) {
    console.log('Using cached top headlines data');
    return cachedData;
  }

  try {
    const url = `${GNEWS_BASE_URL}/top-headlines?country=${country}&lang=${lang}&page=${page}`;
    const response = await fetchWithKeyRotation(url);
    
    const data = await response.json();
    
    // Validate and sanitize articles
    const validatedArticles = (data.articles || [])
      .map(validateArticle)
      .filter((article): article is NewsArticle => article !== null);
    
    const result = {
      totalArticles: validatedArticles.length,
      articles: validatedArticles
    };

    // Cache the result
    apiCache.set(cacheKey, result);
    console.log('Cached top headlines data');
    
    return result;
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      totalArticles: 0,
      articles: []
    };
  }
};

export const searchNews = async (query: string, lang: string = 'en', page: number = 1): Promise<NewsResponse> => {
  try {
    // Sanitize search query
    const sanitizedQuery = sanitizeText(query);
    if (!sanitizedQuery) {
      throw new Error('Invalid search query');
    }

    const cacheKey = `search-${sanitizedQuery}-${lang}-${page}`;
    
    // Check cache first
    const cachedData = apiCache.get<NewsResponse>(cacheKey);
    if (cachedData) {
      console.log('Using cached search data for:', sanitizedQuery);
      return cachedData;
    }
    
    const url = `${GNEWS_BASE_URL}/search?q=${encodeURIComponent(sanitizedQuery)}&lang=${lang}&page=${page}`;
    const response = await fetchWithKeyRotation(url);
    
    const data = await response.json();
    
    // Validate and sanitize articles
    const validatedArticles = (data.articles || [])
      .map(validateArticle)
      .filter((article): article is NewsArticle => article !== null);
    
    const result = {
      totalArticles: validatedArticles.length,
      articles: validatedArticles
    };

    // Cache the result
    apiCache.set(cacheKey, result);
    console.log('Cached search data for:', sanitizedQuery);
    
    return result;
  } catch (error) {
    console.error('Error searching news:', error);
    return {
      totalArticles: 0,
      articles: []
    };
  }
};

export const fetchCategoryNews = async (category: string, country: string = 'us', lang: string = 'en', page: number = 1): Promise<NewsResponse> => {
  try {
    // Normalize the category before validation
    const normalizedCategory = normalizeCategoryForAPI(category);
    
    // Validate category input
    const validCategories = ['world', 'nation', 'politics', 'business', 'technology', 'entertainment', 'sports', 'science', 'health', 'general'];
    if (!validCategories.includes(normalizedCategory)) {
      console.warn(`Invalid category: ${category}, falling back to general`);
      category = 'general';
    } else {
      category = normalizedCategory;
    }

    const cacheKey = `category-${category}-${country}-${lang}-${page}`;
    
    // Check cache first
    const cachedData = apiCache.get<NewsResponse>(cacheKey);
    if (cachedData) {
      console.log('Using cached category data for:', category);
      return cachedData;
    }
    
    const url = `${GNEWS_BASE_URL}/top-headlines?topic=${category}&country=${country}&lang=${lang}&page=${page}`;
    const response = await fetchWithKeyRotation(url);
    
    const data = await response.json();
    
    // Validate and sanitize articles
    const validatedArticles = (data.articles || [])
      .map(validateArticle)
      .filter((article): article is NewsArticle => article !== null);
    
    const result = {
      totalArticles: validatedArticles.length,
      articles: validatedArticles
    };

    // Cache the result
    apiCache.set(cacheKey, result);
    console.log('Cached category data for:', category);
    
    return result;
  } catch (error) {
    console.error('Error fetching category news:', error);
    return {
      totalArticles: 0,
      articles: []
    };
  }
};
