import { toast } from "@/components/ui/use-toast";

// Using the provided YouTube API key
const API_KEY = 'AIzaSyCJn8TEj8CnJdgZP2MLhQjI8C2Q0051oxg';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface Video {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    tags?: string[];
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export interface VideoListResponse {
  items: Video[];
  nextPageToken?: string;
}

export interface Category {
  id: string;
  snippet: {
    title: string;
  };
}

export interface CategoryListResponse {
  items: Category[];
}

// Mock data to use when API key is not provided
const mockVideos: Video[] = [
  {
    id: 'video1',
    snippet: {
      title: 'Sample Video 1',
      description: 'This is a sample video description.',
      channelTitle: 'Demo Channel',
      channelId: 'channel1',
      publishedAt: new Date().toISOString(),
      thumbnails: {
        default: {
          url: 'https://picsum.photos/120/90',
          width: 120,
          height: 90
        },
        medium: {
          url: 'https://picsum.photos/320/180',
          width: 320,
          height: 180
        },
        high: {
          url: 'https://picsum.photos/480/360',
          width: 480,
          height: 360
        }
      },
      tags: ['sample', 'video', 'demo']
    },
    statistics: {
      viewCount: '10243',
      likeCount: '542',
      commentCount: '31'
    }
  },
  {
    id: 'video2',
    snippet: {
      title: 'Sample Video 2',
      description: 'This is another sample video description.',
      channelTitle: 'Demo Channel',
      channelId: 'channel1',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      thumbnails: {
        default: {
          url: 'https://picsum.photos/120/90?random=1',
          width: 120,
          height: 90
        },
        medium: {
          url: 'https://picsum.photos/320/180?random=1',
          width: 320,
          height: 180
        },
        high: {
          url: 'https://picsum.photos/480/360?random=1',
          width: 480,
          height: 360
        }
      }
    },
    statistics: {
      viewCount: '8753',
      likeCount: '421',
      commentCount: '25'
    }
  },
  {
    id: 'video3',
    snippet: {
      title: 'Sample Video 3',
      description: 'This is yet another sample video description.',
      channelTitle: 'Another Channel',
      channelId: 'channel2',
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      thumbnails: {
        default: {
          url: 'https://picsum.photos/120/90?random=2',
          width: 120,
          height: 90
        },
        medium: {
          url: 'https://picsum.photos/320/180?random=2',
          width: 320,
          height: 180
        },
        high: {
          url: 'https://picsum.photos/480/360?random=2',
          width: 480,
          height: 360
        }
      },
      tags: ['tutorial', 'example']
    },
    statistics: {
      viewCount: '15642',
      likeCount: '834',
      commentCount: '67'
    }
  }
];

// Generate more mock videos for a better demo experience
const generateMockVideos = (count: number): Video[] => {
  const result: Video[] = [...mockVideos];
  
  for (let i = 4; i <= count; i++) {
    result.push({
      id: `video${i}`,
      snippet: {
        title: `Sample Video ${i}`,
        description: `This is sample video ${i} description.`,
        channelTitle: i % 2 === 0 ? 'Demo Channel' : 'Another Channel',
        channelId: i % 2 === 0 ? 'channel1' : 'channel2',
        publishedAt: new Date(Date.now() - i * 43200000).toISOString(), // i * 12 hours ago
        thumbnails: {
          default: {
            url: `https://picsum.photos/120/90?random=${i}`,
            width: 120,
            height: 90
          },
          medium: {
            url: `https://picsum.photos/320/180?random=${i}`,
            width: 320,
            height: 180
          },
          high: {
            url: `https://picsum.photos/480/360?random=${i}`,
            width: 480,
            height: 360
          }
        },
        tags: i % 3 === 0 ? ['demo', 'sample'] : undefined
      },
      statistics: {
        viewCount: `${Math.floor(Math.random() * 50000)}`,
        likeCount: `${Math.floor(Math.random() * 5000)}`,
        commentCount: `${Math.floor(Math.random() * 500)}`
      }
    });
  }
  
  return result;
};

const mockCategories: Category[] = [
  { id: '10', snippet: { title: 'Music' } },
  { id: '20', snippet: { title: 'Gaming' } },
  { id: '1', snippet: { title: 'Film & Animation' } },
  { id: '2', snippet: { title: 'Autos & Vehicles' } },
  { id: '15', snippet: { title: 'Pets & Animals' } },
  { id: '17', snippet: { title: 'Sports' } },
  { id: '24', snippet: { title: 'Entertainment' } },
  { id: '26', snippet: { title: 'Howto & Style' } },
  { id: '28', snippet: { title: 'Science & Technology' } }
];

// Updated to only use mock data if API request fails
const shouldUseMockData = (error: any) => {
  console.error('API Error:', error);
  toast({
    title: "API Error",
    description: "Using mock data as fallback.",
    variant: "destructive",
  });
  return true;
};

export const fetchPopularVideos = async (
  pageToken?: string, 
  regionCode: string = 'US', 
  maxResults: number = 20,
  categoryId?: string
): Promise<VideoListResponse> => {
  try {
    let url = `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${API_KEY}`;
    
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }
    
    if (categoryId) {
      url += `&videoCategoryId=${categoryId}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular videos');
    }
    
    const data = await response.json();
    
    return {
      items: data.items.map((item: any) => ({
        ...item,
        id: item.id,
      })),
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error('Error fetching popular videos:', error);
    return shouldUseMockData(error) 
      ? { items: generateMockVideos(maxResults) } 
      : { items: [] };
  }
};

export const fetchVideoCategories = async (
  regionCode: string = 'US'
): Promise<Category[]> => {
  try {
    // If API key is not set, use mock data
    if (API_KEY === 'YOUR_YOUTUBE_API_KEY') {
      console.log('[Mock] Fetching video categories');
      return mockCategories;
    }
    
    const url = `${BASE_URL}/videoCategories?part=snippet&regionCode=${regionCode}&key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video categories');
    }
    
    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id,
      snippet: item.snippet,
    }));
  } catch (error) {
    console.error('Error fetching video categories:', error);
    toast({
      title: "Error",
      description: "Failed to fetch video categories. Please try again later.",
      variant: "destructive",
    });
    return mockCategories;
  }
};

export const searchVideos = async (
  query: string,
  pageToken?: string,
  maxResults: number = 20
): Promise<VideoListResponse> => {
  try {
    let url = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${API_KEY}`;
    
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to search videos');
    }
    
    const data = await response.json();
    
    // Get video IDs from the search results
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    
    // Fetch additional video details including statistics
    const videoDetailsUrl = `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
    const videoDetailsResponse = await fetch(videoDetailsUrl);
    
    if (!videoDetailsResponse.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const videoDetailsData = await videoDetailsResponse.json();
    
    return {
      items: videoDetailsData.items.map((item: any) => ({
        ...item,
        id: item.id,
      })),
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error('Error searching videos:', error);
    toast({
      title: "Error",
      description: "Failed to search videos. Please try again later.",
      variant: "destructive",
    });
    return { items: [] };
  }
};

export const fetchVideoDetails = async (videoId: string): Promise<Video | null> => {
  try {
    const url = `${BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const data = await response.json();
    
    if (data.items.length === 0) {
      return null;
    }
    
    return {
      ...data.items[0],
      id: data.items[0].id,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    toast({
      title: "Error",
      description: "Failed to fetch video details. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchRelatedVideos = async (videoId: string, maxResults: number = 10): Promise<Video[]> => {
  try {
    const url = `${BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch related videos');
    }
    
    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      snippet: item.snippet,
    }));
  } catch (error) {
    console.error('Error fetching related videos:', error);
    toast({
      title: "Error",
      description: "Failed to fetch related videos. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchChannelDetails = async (channelId: string): Promise<any> => {
  try {
    const url = `${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch channel details');
    }
    
    const data = await response.json();
    
    if (data.items.length === 0) {
      return null;
    }
    
    return data.items[0];
  } catch (error) {
    console.error('Error fetching channel details:', error);
    toast({
      title: "Error",
      description: "Failed to fetch channel details. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};
