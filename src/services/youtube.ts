
import { toast } from "@/components/ui/use-toast";

// This is a placeholder for a YouTube API key. In a real app, this would be stored in an environment variable.
// Note: For a frontend-only application, the key will be exposed in the browser. For a production app,
// you should proxy these requests through a backend.
const API_KEY = 'YOUR_YOUTUBE_API_KEY';

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
    toast({
      title: "Error",
      description: "Failed to fetch popular videos. Please try again later.",
      variant: "destructive",
    });
    return { items: [] };
  }
};

export const fetchVideoCategories = async (
  regionCode: string = 'US'
): Promise<Category[]> => {
  try {
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
    return [];
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
