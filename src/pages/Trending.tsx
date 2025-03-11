
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoGrid from '@/components/VideoGrid';
import { fetchPopularVideos } from '@/services/youtube';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const Trending = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [category, setCategory] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['trendingVideos', category],
    queryFn: async () => {
      const videoCategoryId = category === 'all' ? undefined : 
                             category === 'music' ? '10' : 
                             category === 'gaming' ? '20' : 
                             category === 'movies' ? '1' : undefined;
      
      const result = await fetchPopularVideos(undefined, 'US', 20, videoCategoryId);
      return result.items;
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load trending videos. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-youtube-dark text-white">
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 p-4 pt-4 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Trending</h1>
            
            <Tabs defaultValue="all" value={category} onValueChange={setCategory}>
              <TabsList className="bg-youtube-card border border-youtube-border">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black">Now</TabsTrigger>
                <TabsTrigger value="music" className="data-[state=active]:bg-white data-[state=active]:text-black">Music</TabsTrigger>
                <TabsTrigger value="gaming" className="data-[state=active]:bg-white data-[state=active]:text-black">Gaming</TabsTrigger>
                <TabsTrigger value="movies" className="data-[state=active]:bg-white data-[state=active]:text-black">Movies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="pt-4">
                <VideoGrid videos={data || []} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="music" className="pt-4">
                <VideoGrid videos={data || []} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="gaming" className="pt-4">
                <VideoGrid videos={data || []} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="movies" className="pt-4">
                <VideoGrid videos={data || []} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Trending;
