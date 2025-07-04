
import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { NewsGrid } from "@/components/NewsGrid";
import { Footer } from "@/components/Footer";
import { saveRecentSearch } from "@/utils/recentSearches";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("world");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchStateChange = (query: string, loading: boolean) => {
    setSearchLoading(loading);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(""); // Clear search when selecting category
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onCategorySelect={handleCategorySelect}
        searchQuery={searchQuery}
        searchLoading={searchLoading}
        activeCategory={activeCategory}
      />
      <main>
        <HeroSection 
          searchQuery={searchQuery}
          onSearchStateChange={handleSearchStateChange}
          selectedCategory={activeCategory}
        />
        {!searchQuery && <NewsGrid />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
