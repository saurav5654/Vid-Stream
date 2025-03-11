
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Flame, Music2, Film, GamepadIcon, Newspaper, Trophy, 
  Lightbulb, Shirt, ShoppingBag, Award, Broadcast 
} from 'lucide-react';

const categories = [
  { id: 'trending', name: 'Trending', icon: Flame, color: 'bg-red-500', path: '/trending' },
  { id: 'music', name: 'Music', icon: Music2, color: 'bg-pink-500', path: '/music' },
  { id: 'movies', name: 'Movies & TV', icon: Film, color: 'bg-blue-500', path: '/movies' },
  { id: 'gaming', name: 'Gaming', icon: GamepadIcon, color: 'bg-green-500', path: '/gaming' },
  { id: 'news', name: 'News', icon: Newspaper, color: 'bg-yellow-500', path: '/news' },
  { id: 'sports', name: 'Sports', icon: Trophy, color: 'bg-purple-500', path: '/sports' },
  { id: 'learning', name: 'Learning', icon: Lightbulb, color: 'bg-indigo-500', path: '/learning' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, color: 'bg-cyan-500', path: '/fashion' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-emerald-500', path: '/shopping' },
  { id: 'premieres', name: 'Premieres', icon: Award, color: 'bg-amber-500', path: '/premieres' },
  { id: 'live', name: 'Live', icon: Broadcast, color: 'bg-rose-500', path: '/live' },
];

const Explore = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-youtube-dark text-white">
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 p-4 pt-4 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
          <h1 className="text-2xl font-bold mb-6">Explore</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className="bg-youtube-card border-youtube-border cursor-pointer hover:bg-youtube-hover transition-colors"
                onClick={() => navigate(category.path)}
              >
                <CardContent className="p-6 flex items-center">
                  <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium">{category.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 mb-6">
            <h2 className="text-xl font-bold mb-4">YouTube Premium Originals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Empty cards as placeholders for Premium content */}
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="bg-youtube-card border-youtube-border overflow-hidden">
                  <div className="aspect-video bg-youtube-hover relative">
                    <div className="absolute top-2 right-2 bg-youtube-red text-white text-xs px-2 py-1 rounded">
                      PREMIUM
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium mb-1">Premium Original Series {index + 1}</h3>
                    <p className="text-sm text-youtube-gray">YouTube Originals</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;
