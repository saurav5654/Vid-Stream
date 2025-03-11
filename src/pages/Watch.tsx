
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Share, Download, Scissors, Save, Flag, MoreHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { fetchVideoDetails, fetchRelatedVideos, fetchChannelDetails } from '@/services/youtube';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const Watch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoId = searchParams.get('v');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Redirect if no video ID is provided
  useEffect(() => {
    if (!videoId) {
      navigate('/');
    }
  }, [videoId, navigate]);

  const { data: videoDetails, isLoading: isVideoLoading } = useQuery({
    queryKey: ['videoDetails', videoId],
    queryFn: async () => {
      if (!videoId) return null;
      return fetchVideoDetails(videoId);
    },
    enabled: !!videoId,
  });

  const { data: channelDetails, isLoading: isChannelLoading } = useQuery({
    queryKey: ['channelDetails', videoDetails?.snippet?.channelId],
    queryFn: async () => {
      if (!videoDetails?.snippet?.channelId) return null;
      return fetchChannelDetails(videoDetails.snippet.channelId);
    },
    enabled: !!videoDetails?.snippet?.channelId,
  });

  const { data: relatedVideos = [], isLoading: isRelatedVideosLoading } = useQuery({
    queryKey: ['relatedVideos', videoId],
    queryFn: async () => {
      if (!videoId) return [];
      return fetchRelatedVideos(videoId);
    },
    enabled: !!videoId,
  });

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const formatSubscriberCount = (count: string) => {
    const num = parseInt(count, 10);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M subscribers`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K subscribers`;
    }
    return `${num} subscribers`;
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count, 10);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  };

  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!videoId) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-youtube-dark text-white">
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex flex-1 pt-4">
        <main className="flex-1 mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video player and info section */}
            <div className="flex-1">
              <VideoPlayer videoId={videoId} />
              
              {isVideoLoading ? (
                <div className="mt-4 animate-pulse">
                  <div className="h-7 bg-youtube-card rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-youtube-card rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-youtube-card rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-youtube-card rounded w-full"></div>
                </div>
              ) : videoDetails ? (
                <div className="mt-4">
                  <h1 className="text-xl font-bold mb-2">{videoDetails.snippet.title}</h1>
                  
                  <div className="flex flex-col sm:flex-row justify-between mb-4">
                    <div className="flex items-center">
                      {!isChannelLoading && channelDetails && (
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white font-medium mr-3">
                            {channelDetails.snippet.title.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{channelDetails.snippet.title}</div>
                            <div className="text-sm text-youtube-gray">
                              {formatSubscriberCount(channelDetails.statistics.subscriberCount)}
                            </div>
                          </div>
                        </div>
                      )}
                      <Button 
                        className="ml-4 bg-white text-black hover:bg-gray-200 rounded-full"
                      >
                        Subscribe
                      </Button>
                    </div>
                    
                    <div className="flex items-center mt-4 sm:mt-0">
                      <div className="flex mr-2 bg-youtube-card rounded-full overflow-hidden">
                        <Button 
                          variant="ghost" 
                          className="hover:bg-youtube-hover rounded-r-none"
                        >
                          <ThumbsUp className="mr-2 h-5 w-5" />
                          {parseInt(videoDetails.statistics?.likeCount || '0', 10).toLocaleString()}
                        </Button>
                        <Separator orientation="vertical" />
                        <Button 
                          variant="ghost" 
                          className="hover:bg-youtube-hover rounded-l-none"
                        >
                          <ThumbsDown className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        className="bg-youtube-card hover:bg-youtube-hover rounded-full ml-2"
                      >
                        <Share className="mr-2 h-5 w-5" />
                        Share
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="bg-youtube-card hover:bg-youtube-hover rounded-full ml-2"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="bg-youtube-card hover:bg-youtube-hover rounded-full ml-2"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-youtube-card rounded-xl p-3 mb-6">
                    <div className="flex items-center text-sm mb-1">
                      <span className="font-semibold mr-2">
                        {formatViewCount(videoDetails.statistics?.viewCount || '0')}
                      </span>
                      <span className="mr-2">
                        {formatPublishedDate(videoDetails.snippet.publishedAt)}
                      </span>
                      
                      {videoDetails.snippet.tags && videoDetails.snippet.tags?.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="mr-1 bg-transparent text-youtube-gray">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className={`text-sm whitespace-pre-wrap ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                      {videoDetails.snippet.description}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="text-sm mt-1 p-0 h-auto hover:bg-transparent hover:underline"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                      {isDescriptionExpanded ? 'Show less' : 'Show more'}
                      {isDescriptionExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-center">Video not found</div>
              )}
              
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-4">Comments</h2>
                {/* In a real implementation, comments would be fetched and rendered here */}
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-3">
                    U
                  </div>
                  <div className="flex-1">
                    <div className="bg-youtube-card rounded-xl p-4">
                      <div className="flex items-center mb-1">
                        <span className="font-medium">User123</span>
                        <span className="text-youtube-gray text-sm ml-2">3 days ago</span>
                      </div>
                      <p className="text-sm">This is a great video! Thanks for sharing this content.</p>
                      <div className="mt-2 flex items-center">
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          24
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto ml-3">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto ml-3 text-sm">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="bg-youtube-card hover:bg-youtube-hover text-white border-youtube-border">
                  Show more comments
                </Button>
              </div>
            </div>
            
            {/* Related videos section */}
            <div className="lg:w-80 xl:w-96">
              <h2 className="text-lg font-bold mb-4 sr-only">Related Videos</h2>
              
              {isRelatedVideosLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex animate-pulse">
                      <div className="w-40 h-20 bg-youtube-card rounded-lg"></div>
                      <div className="ml-2 flex-1">
                        <div className="h-4 bg-youtube-card rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-youtube-card rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-youtube-card rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {relatedVideos.map((video: any) => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      layout="list" 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Watch;
