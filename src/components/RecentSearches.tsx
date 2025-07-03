
import { Button } from '@/components/ui/button';
import { getRecentSearches, clearRecentSearches } from '@/utils/recentSearches';
import { useState, useEffect } from 'react';

interface RecentSearchesProps {
  onSearchSelect: (query: string) => void;
}

export const RecentSearches = ({ onSearchSelect }: RecentSearchesProps) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const handleClearAll = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">Recent Searches</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearAll}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((search, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSearchSelect(search)}
            className="text-xs"
          >
            {search}
          </Button>
        ))}
      </div>
    </div>
  );
};
