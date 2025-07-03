
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { NewsGrid } from "@/components/NewsGrid";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NewsGrid />
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
