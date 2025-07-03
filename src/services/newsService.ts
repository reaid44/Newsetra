import { apiCache } from '@/utils/apiCache';

const GNEWS_API_KEY = 'fe777c2cfdf243f6e1c4f400c397a7ad';
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
    const response = await fetch(
      `${GNEWS_BASE_URL}/top-headlines?country=${country}&lang=${lang}&page=${page}&token=${GNEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
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
    
    const response = await fetch(
      `${GNEWS_BASE_URL}/search?q=${encodeURIComponent(sanitizedQuery)}&lang=${lang}&page=${page}&token=${GNEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search news');
    }
    
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
    // Validate category input
    const validCategories = ['world', 'nation', 'politics', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];
    if (!validCategories.includes(category)) {
      throw new Error('Invalid category');
    }

    const cacheKey = `category-${category}-${country}-${lang}-${page}`;
    
    // Check cache first
    const cachedData = apiCache.get<NewsResponse>(cacheKey);
    if (cachedData) {
      console.log('Using cached category data for:', category);
      return cachedData;
    }
    
    const response = await fetch(
      `${GNEWS_BASE_URL}/top-headlines?topic=${category}&country=${country}&lang=${lang}&page=${page}&token=${GNEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch category news');
    }
    
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
