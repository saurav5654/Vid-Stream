
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoGrid from '@/components/VideoGrid';
import { searchVideos } from '@/services/youtube';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Search = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchVideos', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return { items: [] };
      return searchVideos(searchQuery);
    },
    enabled: !!searchQuery,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch search results. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-youtube-dark text-white">
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 p-4 pt-4 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
          {searchQuery ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl">Search results for "{searchQuery}"</h1>
                <Button 
                  variant="outline" 
                  className="bg-youtube-card hover:bg-youtube-hover text-white border-youtube-border"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
              
              <VideoGrid 
                videos={data?.items || []} 
                isLoading={isLoading} 
                layout="list" 
              />
              
              {!isLoading && data?.items && data.items.length === 0 && (
                <div className="text-center py-10">
                  <h2 className="text-lg font-semibold mb-2">No videos found</h2>
                  <p className="text-youtube-gray">Try different keywords or check your spelling</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[70vh]">
              <h1 className="text-xl mb-2">Search for videos</h1>
              <p className="text-youtube-gray">Enter your search query in the search bar above</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
