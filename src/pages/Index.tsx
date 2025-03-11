
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoGrid from '@/components/VideoGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { fetchPopularVideos, fetchVideoCategories } from '@/services/youtube';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState('0'); // '0' = all categories

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['videoCategories'],
    queryFn: async () => {
      const categories = await fetchVideoCategories();
      // Filter out categories that are typically not shown on YouTube home
      const filteredCategories = categories.filter(
        (category) => !['21', '22', '25', '42', '43', '44'].includes(category.id)
      );
      return [{ id: '0', snippet: { title: 'All' } }, ...filteredCategories];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const { data: videos = [], isLoading: isVideosLoading } = useQuery({
    queryKey: ['popularVideos', selectedCategoryId],
    queryFn: async () => {
      try {
        const result = await fetchPopularVideos(
          undefined,
          'US',
          24,
          selectedCategoryId === '0' ? undefined : selectedCategoryId
        );
        return result.items;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load videos. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-youtube-dark text-white">
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 p-4 pt-4 overflow-hidden ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
          <CategoryFilter 
            categories={
              isCategoriesLoading 
                ? [{ id: '0', name: 'All' }] 
                : categories.map(c => ({ id: c.id, name: c.snippet.title }))
            }
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
          />
          
          <VideoGrid 
            videos={videos} 
            isLoading={isVideosLoading} 
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
