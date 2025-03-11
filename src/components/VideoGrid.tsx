
import React from 'react';
import VideoCard from './VideoCard';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoGridProps {
  videos: any[];
  isLoading: boolean;
  layout?: 'grid' | 'list';
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, isLoading, layout = 'grid' }) => {
  if (isLoading) {
    return (
      <div className={layout === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className={layout === 'grid' ? "" : "flex gap-4"}>
            <Skeleton className={layout === 'grid' ? "aspect-video w-full mb-3" : "aspect-video w-60 flex-shrink-0"} />
            <div className={layout === 'grid' ? "flex" : "flex-1"}>
              {layout === 'grid' && (
                <Skeleton className="h-9 w-9 rounded-full mr-3" />
              )}
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!videos.length) {
    return <div className="text-center py-8">No videos found</div>;
  }

  return (
    <div className={layout === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} layout={layout} />
      ))}
    </div>
  );
};

export default VideoGrid;
