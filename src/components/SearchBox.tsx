
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RecentSearches } from '@/components/RecentSearches';
import { saveRecentSearch } from '@/utils/recentSearches';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export const SearchBox = ({ onSearch, loading = false, placeholder = "Search news..." }: SearchBoxProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      onSearch(query.trim());
    }
  };

  const handleSearchSelect = (selectedQuery: string) => {
    setQuery(selectedQuery);
    onSearch(selectedQuery);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
        {query && (
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        )}
      </form>
      
      <RecentSearches onSearchSelect={handleSearchSelect} />
    </div>
  );
};
