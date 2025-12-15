export interface VideoItem {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    thumbnails?: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    liveBroadcastContent: string;
    publishTime: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export interface SelectedVideoType {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;

  localSource?: string;
}

export type CategorizedVideos = {
  [category: string]: VideoItem[];
} | null;

interface FetchVideosOptions {
  query?: string;
  maxResults?: number;
  order?: "date" | "viewCount" | "relevance" | "oldest";
  channelId?: string;
}

export interface YoutubeContextType {
  videos: VideoItem[];
  isLoading: boolean;
  error: string | null;
  refetchCategorizedVideos: (options?: FetchVideosOptions) => Promise<void>;

  categorizedVideos: CategorizedVideos;

  isVideoModalVisible: boolean;
  selectedVideo: SelectedVideoType | null;
  handleVideoPress: (video: VideoItem) => void;
  closeVideoModal: () => void;
  handleLocalVideoPress: () => void;
}
