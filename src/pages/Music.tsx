
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoGrid from '@/components/VideoGrid';
import { fetchPopularVideos } from '@/services/youtube';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const Music = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [category, setCategory] = useState('popular');

  const { data, isLoading } = useQuery({
    queryKey: ['musicVideos'],
    queryFn: async () => {
      try {
        // Fetch music category videos (category ID 10 is for Music)
        const result = await fetchPopularVideos(undefined, 'US', 24, '10');
        return result.items;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load music videos. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
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
            <h1 className="text-2xl font-bold mb-4">Music</h1>
            
            <Tabs defaultValue="popular" value={category} onValueChange={setCategory}>
              <TabsList className="bg-youtube-card border border-youtube-border">
                <TabsTrigger value="popular" className="data-[state=active]:bg-white data-[state=active]:text-black">Popular</TabsTrigger>
                <TabsTrigger value="new" className="data-[state=active]:bg-white data-[state=active]:text-black">New Releases</TabsTrigger>
                <TabsTrigger value="playlists" className="data-[state=active]:bg-white data-[state=active]:text-black">Playlists</TabsTrigger>
                <TabsTrigger value="genres" className="data-[state=active]:bg-white data-[state=active]:text-black">Genres</TabsTrigger>
              </TabsList>
              
              <TabsContent value="popular" className="pt-4">
                <VideoGrid videos={data || []} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="new" className="pt-4">
                <VideoGrid videos={data || []} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="playlists" className="pt-4">
                <VideoGrid videos={data || []} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="genres" className="pt-4">
                <VideoGrid videos={data || []} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Music;
