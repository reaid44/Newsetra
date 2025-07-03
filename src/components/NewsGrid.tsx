import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchTopHeadlines, NewsArticle } from "@/services/newsService";

export const NewsGrid = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchTopHeadlines();
        if (newsData.articles && newsData.articles.length > 1) {
          // Skip the first article as it's used in the hero section
          setArticles(newsData.articles.slice(1, 7));
        }
      } catch (error) {
        console.error('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse"></div>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-video">
              {article.image ? (
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${article.image ? 'hidden' : ''}`}>
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  📰
                </span>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {article.source.name}
                </Badge>
              </div>
              <SafeLink 
                href={article.url}
                className="block hover:text-blue-600 transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </SafeLink>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <span>By {article.source.name}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                  className="hover:bg-blue-50 hover:border-blue-300"
                >
                  Keep Reading
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
