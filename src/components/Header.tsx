
import { Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { RecentSearches } from "@/components/RecentSearches";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  searchQuery?: string;
  searchLoading?: boolean;
}

export const Header = ({ onSearch, onClearSearch, searchQuery = "", searchLoading = false }: HeaderProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && localQuery.trim()) {
      onSearch(localQuery.trim());
      setShowRecentSearches(false);
    }
  };

  const handleSearchClick = () => {
    if (onSearch && localQuery.trim()) {
      onSearch(localQuery.trim());
      setShowRecentSearches(false);
    }
  };

  const handleClear = () => {
    setLocalQuery("");
    setShowRecentSearches(false);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const handleInputFocus = () => {
    setShowRecentSearches(true);
  };

  const handleRecentSearchSelect = (query: string) => {
    setLocalQuery(query);
    if (onSearch) {
      onSearch(query);
    }
    setShowRecentSearches(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MT</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Magnolia Tribune</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder={searchLoading ? "Searching..." : "Search news..."} 
                  className="pl-10 w-64 pr-24"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
                  disabled={searchLoading}
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {localQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    onClick={handleSearchClick}
                    disabled={searchLoading || !localQuery.trim()}
                    className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Search
                  </Button>
                </div>
              </form>
              
              {showRecentSearches && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50">
                  <RecentSearches onSearchSelect={handleRecentSearchSelect} />
                </div>
              )}
            </div>
            
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="hidden md:flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear Search</span>
              </Button>
            )}
            
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
