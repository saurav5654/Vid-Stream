
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: {
    id: string;
    snippet: {
      title: string;
      channelTitle: string;
      thumbnails: {
        medium: {
          url: string;
        };
        high: {
          url: string;
        };
      };
      publishedAt: string;
    };
    statistics?: {
      viewCount: string;
    };
  };
  layout?: 'grid' | 'list';
}

const VideoCard: React.FC<VideoCardProps> = ({ video, layout = 'grid' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch?v=${video.id}`);
  };

  const formatViews = (viewCount: string) => {
    const count = parseInt(viewCount, 10);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  const formatPublishedAt = (publishedAt: string) => {
    return formatDistanceToNow(new Date(publishedAt), { addSuffix: true });
  };

  return (
    <div 
      className={cn(
        "group cursor-pointer",
        layout === 'grid' ? "w-full pb-4" : "flex gap-4 pb-2"
      )}
      onClick={handleClick}
    >
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl",
          layout === 'grid' ? "aspect-video w-full mb-3" : "flex-shrink-0 aspect-video w-40 sm:w-60"
        )}
      >
        <img
          src={video.snippet.thumbnails.high.url || video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
          4:15
        </div>
      </div>
      
      <div className={cn(
        "flex",
        layout === 'grid' ? "" : "flex-1"
      )}>
        {layout === 'grid' && (
          <div className="mr-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center text-white font-medium">
              {video.snippet.channelTitle.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 mb-1">
            {video.snippet.title}
          </h3>
          <p className="text-youtube-gray text-xs sm:text-sm">
            {video.snippet.channelTitle}
          </p>
          <div className="flex text-youtube-gray text-xs mt-1">
            {video.statistics?.viewCount && (
              <>
                <span>{formatViews(video.statistics.viewCount)}</span>
                <span className="mx-1">•</span>
              </>
            )}
            <span>{formatPublishedAt(video.snippet.publishedAt)}</span>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden group-hover:flex rounded-full h-8 w-8 text-youtube-gray"
            onClick={(e) => {
              e.stopPropagation();
              // Handle more button click
            }}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
