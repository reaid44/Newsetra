
import { Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Header = () => {
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
          
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Politics</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Business</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Sports</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Opinion</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Local</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search news..." 
                className="pl-10 w-64"
              />
            </div>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
