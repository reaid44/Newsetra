import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTopHeadlines, fetchCategoryNews, searchNews, NewsArticle } from "@/services/newsService";
import { SearchBox } from "@/components/SearchBox";

const CATEGORIES = [
  { id: 'world', label: 'World' },
  { id: 'nation', label: 'Nation' },
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Technology' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' }
];

export const HeroSection = () => {
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [categoryNews, setCategoryNews] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('world');
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const loadCategoryNews = async (category: string) => {
    setCategoryLoading(true);
    try {
      const newsData = await fetchCategoryNews(category);
      setCategoryNews(newsData.articles || []);
    } catch (error) {
      console.error('Failed to load category news');
      setCategoryNews([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // If search is cleared, reload category news
      loadCategoryNews(selectedCategory);
      return;
    }

    setSearchLoading(true);
    try {
      const searchData = await searchNews(query);
      setCategoryNews(searchData.articles || []);
    } catch (error) {
      console.error('Failed to search news');
      setCategoryNews([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const loadFeaturedNews = async () => {
      try {
        const newsData = await fetchTopHeadlines();
        if (newsData.articles && newsData.articles.length > 0) {
          setFeaturedArticle(newsData.articles[0]);
        }
      } catch (error) {
        console.error('Failed to load featured news');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedNews();
  }, []);

  useEffect(() => {
    loadCategoryNews(selectedCategory);
  }, [selectedCategory]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const SafeLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );

  if (loading) {
    return (
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-4 bg-blue-300 rounded-lg flex items-center justify-center animate-pulse">
                    <span className="text-2xl">📰</span>
                  </div>
                  <p>Loading...</p>
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (!featuredArticle) {
    return (
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-4 bg-blue-300 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📰</span>
                  </div>
                  <p>No news available</p>
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <p className="text-gray-600">Unable to load news at this time.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Category Filter Buttons */}
            <div className="p-8 lg:p-12 col-span-full">
              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSearchQuery(''); // Clear search when changing category
                    }}
                    className={`px-3 py-1 rounded transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Article */}
            <div className="aspect-video lg:aspect-auto">
              {featuredArticle?.image ? (
                <img 
                  src={featuredArticle.image} 
                  alt="News Image"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`aspect-video lg:aspect-auto bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ${featuredArticle?.image ? 'hidden' : ''}`}>
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-4 bg-blue-300 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📰</span>
                  </div>
                  <p>Featured News</p>
                </div>
              </div>
            </div>
            <div className="p-8 lg:p-12">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-red-100 text-red-700">Breaking</Badge>
                <Badge variant="outline">{featuredArticle?.source.name}</Badge>
              </div>
              <h2 className="text-xl font-semibold text-blue-700 hover:underline mb-4">
                <SafeLink href={featuredArticle?.url}>
                  {featuredArticle?.title}
                </SafeLink>
              </h2>
              <p className="text-gray-700 mt-2 mb-3">
                {featuredArticle?.description}
              </p>
              <div className="flex items-center space-x-4">
                <SafeLink 
                  href={featuredArticle?.url}
                  className="inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Read Full Article
                </SafeLink>
                <div className="text-sm text-gray-500">
                  <span>By {featuredArticle?.source.name}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredArticle && formatTimeAgo(featuredArticle.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Search and News Container */}
        <div className="mt-8">
          <SearchBox 
            onSearch={handleSearch}
            loading={searchLoading}
            placeholder="Search news by topic (e.g., bitcoin, election, NASA)..."
          />
          
          <h3 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
            {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} News`}
          </h3>
          
          {(categoryLoading || searchLoading) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-4 rounded shadow">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : categoryNews.length === 0 ? (
            <p className="text-gray-500">
              {searchQuery ? 'No news found for your search.' : 'No news found for this category.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryNews.map((article, index) => (
                <div key={index} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
                  <img 
                    src={article.image} 
                    alt="news image"
                    className="w-full h-48 object-cover mb-3 rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  <h2 className="text-lg font-bold text-blue-700 mb-2">
                    <SafeLink href={article.url} className="hover:underline">
                      {article.title}
                    </SafeLink>
                  </h2>
                  <p className="text-gray-700 mb-3">{article.description}</p>
                  <SafeLink 
                    href={article.url}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Read Full Article
                  </SafeLink>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
