
import React, { useState } from 'react';
import { Search, Menu, Bell, Video, Mic, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full px-4 py-2 bg-youtube-dark border-b border-youtube-border">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white" 
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center ml-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative w-8 h-8 mr-1">
            <div className="absolute inset-0 bg-youtube-red rounded-sm"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-l-8 border-t-4 border-b-4 border-l-white border-t-transparent border-b-transparent"></div>
          </div>
          <span className="text-xl font-semibold">YouTube</span>
        </div>
      </div>

      <div className={cn("hidden md:flex items-center flex-grow justify-center max-w-2xl", 
        "mx-4")}>
        <form onSubmit={handleSearch} className="flex w-full">
          <div className="relative flex-grow">
            <Input 
              type="text"
              placeholder="Search"
              className="h-10 py-2 pl-4 pr-10 bg-youtube-dark border border-youtube-border rounded-l-full text-sm placeholder:text-youtube-gray focus-visible:ring-youtube-red focus-visible:ring-offset-0 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            variant="ghost" 
            className="h-10 px-6 bg-youtube-card hover:bg-youtube-hover rounded-r-full border border-l-0 border-youtube-border"
          >
            <Search className="h-5 w-5 text-youtube-gray" />
          </Button>
        </form>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2 bg-youtube-card hover:bg-youtube-hover rounded-full h-10 w-10"
        >
          <Mic className="h-5 w-5 text-white" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white"
          onClick={() => navigate('/search')}
        >
          <Search className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hidden sm:flex"
        >
          <Video className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hidden sm:flex"
        >
          <Bell className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-purple-500 rounded-full h-8 w-8"
        >
          <User className="h-5 w-5 text-white" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
