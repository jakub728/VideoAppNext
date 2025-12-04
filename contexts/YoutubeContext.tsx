import React, { createContext, useState, FC, ReactNode, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY: string | undefined = process.env.API_KEY;
const BASE_URL: string | undefined = process.env.BASE_URL;
const STORAGE_KEY: string = "@CategorizedVideosCache";
const CATEGORIES: string[] = ["REACT-NATIVE", "REACT", "TYPESCRIPT"];
const VIDEOS_PER_CATEGORY: number = 5;

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

interface SelectedVideoType {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
}

type CategorizedVideos = {
  [category: string]: VideoItem[];
} | null;

interface FetchVideosOptions {
  query?: string;
  maxResults?: number;
  order?: "date" | "viewCount" | "relevance" | "oldest";
  channelId?: string;
}

interface YoutubeProviderProps {
  children: ReactNode;
}

interface YoutubeContextType {
  videos: VideoItem[];
  loading: boolean;
  error: string | null;
  fetchVideos: (options?: FetchVideosOptions) => Promise<void>;

  categorizedVideos: CategorizedVideos;
  isCacheLoading: boolean;
  fetchCategorizedVideos: () => Promise<void>;

  isVideoModalVisible: boolean;
  selectedVideo: SelectedVideoType | null;
  handleVideoPress: (video: VideoItem) => void;
  closeVideoModal: () => void;
}

export const YoutubeContext = createContext<YoutubeContextType>({
  videos: [],
  loading: false,
  error: null,

  fetchVideos: async () => {},
  categorizedVideos: null,
  isCacheLoading: false,
  fetchCategorizedVideos: async () => {},

  isVideoModalVisible: false,
  selectedVideo: null,
  handleVideoPress: () => {},
  closeVideoModal: () => {},
});

async function fetchStatisticsForVideos(
  videoIds: string[],
  apiKey: string | undefined
): Promise<Record<string, VideoItem["statistics"]>> {
  if (!apiKey || videoIds.length === 0) {
    return {};
  }

  const STATS_URL = `${BASE_URL?.replace(
    "search",
    "videos"
  )}?part=statistics&id=${videoIds.join(",")}&key=${apiKey}`;

  try {
    const response = await fetch(STATS_URL);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || `HTTP Error: ${response.status}`);
    }

    const statsMap: Record<string, VideoItem["statistics"]> = {};

    data.items.forEach((item: any) => {
      if (item.id && item.statistics) {
        statsMap[item.id] = item.statistics;
      }
    });

    return statsMap;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return {};
  }
}

export const YoutubeProvider: FC<YoutubeProviderProps> = ({ children }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categorizedVideos, setCategorizedVideos] =
    useState<CategorizedVideos>(null);
  const [isCacheLoading, setIsCacheLoading] = useState<boolean>(false);

  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideoType | null>(
    null
  );

  // Save to AsyncStorage
  const saveVideosToStorage = async (
    data: CategorizedVideos
  ): Promise<void> => {
    try {
      if (data) {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log("Data saved in AsyncStorage");
      }
    } catch (e) {
      console.error("Error writing to AsyncStorage:", e);
    }
  };

  // Load from AsyncStorage
  const loadVideosFromStorage = async (): Promise<CategorizedVideos> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        const storedData: CategorizedVideos = JSON.parse(jsonValue);
        console.log("Data loaded from AsyncStorage");
        return storedData;
      }
      return null;
    } catch (e) {
      console.error("Error reading AsyncStorage:", e);
      return null;
    }
  };

  // Open video Modal
  const handleVideoPress = (video: VideoItem) => {
    setSelectedVideo({
      videoId: video.id.videoId,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      description: video.snippet.description,
      viewCount: video.statistics?.viewCount,
      likeCount: video.statistics?.likeCount,
      commentCount: video.statistics?.commentCount,
    });
    setIsVideoModalVisible(true);
  };

  // Close video Modal
  const closeVideoModal = () => {
    setIsVideoModalVisible(false);
    setSelectedVideo(null);
  };

  //! Fetch Home videos
  const fetchCategorizedVideos = async (): Promise<void> => {
    setIsCacheLoading(true);
    setError(null);

    const cachedData = await loadVideosFromStorage();
    if (cachedData) {
      setCategorizedVideos(cachedData);
      setIsCacheLoading(false);
      return;
    }

    if (!API_KEY || !BASE_URL) {
      const msg = "No API_KEY or BASE_URL";
      setError(msg);
      setIsCacheLoading(false);
      return;
    }

    const newCategorizedVideos: CategorizedVideos = {};
    let allSucceeded = true;
    let allVideoIds: string[] = [];

    for (const category of CATEGORIES) {
      const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(
        category
      )}&type=video&maxResults=${VIDEOS_PER_CATEGORY}&order=viewCount&key=${API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || data.error) {
          const errorMsg =
            data.error?.message || `HTTP Error: ${response.status}`;
          throw new Error(errorMsg);
        }

        const items = (data.items as VideoItem[]) || [];
        newCategorizedVideos[category] = items;

        items.forEach((item) => {
          if (item.id && item.id.videoId) {
            allVideoIds.push(item.id.videoId);
          }
        });
      } catch (err) {
        const error = err as Error;
        console.error(
          `Error loading categories (fetchCategorizedVideos) ${category}:`,
          error
        );
        newCategorizedVideos[category] = [];
        allSucceeded = false;
        setError(error.message || "Not possible to load all categories");
        break;
      }
    }

    if (allSucceeded && Object.keys(newCategorizedVideos).length > 0) {
      const statsMap = await fetchStatisticsForVideos(allVideoIds, API_KEY);

      for (const category in newCategorizedVideos) {
        newCategorizedVideos[category] = newCategorizedVideos[category].map(
          (video) => ({
            ...video,
            statistics: statsMap[video.id.videoId] || video.statistics,
          })
        );
      }

      await saveVideosToStorage(newCategorizedVideos);
      setCategorizedVideos(newCategorizedVideos);
    } else if (Object.keys(newCategorizedVideos).length > 0) {
      setCategorizedVideos(newCategorizedVideos);
    }

    setIsCacheLoading(false);
  };

  //! Fetch Search videos
  const fetchVideos = async (
    options: FetchVideosOptions = {}
  ): Promise<void> => {
    const {
      query = "React Native", //wyszukiwanie
      maxResults = 10, // liczba wynikow
      order = "relevance", // sortowanie ('date', 'viewCount', 'relevance', "oldest")
      channelId = "", // ID kanału
    } = options;

    if (!API_KEY || !BASE_URL) {
      setError("No API key or BASE_URL BASE URL");
      return;
    }

    setLoading(true);
    setError(null);

    const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&maxResults=${maxResults}&order=${order}&key=${API_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg =
          errorData.error?.message || `HTTP Error: ${response.status}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      let searchResults = (data.items as VideoItem[]) || [];

      const videoIds = searchResults
        .map((item) => item.id.videoId)
        .filter(Boolean) as string[];

      if (videoIds.length > 0 && API_KEY) {
        const statsMap = await fetchStatisticsForVideos(videoIds, API_KEY);

        searchResults = searchResults.map((video) => ({
          ...video,
          statistics: statsMap[video.id.videoId] || video.statistics,
        }));
      }

      setVideos(searchResults);
    } catch (err) {
      const error = err as Error;
      console.error("Error loading videos (fetchVideos):", err);
      setError(error.message || "Error loading videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const contextValue: YoutubeContextType = useMemo(
    () => ({
      videos,
      loading,
      error,
      fetchVideos,
      categorizedVideos,
      isCacheLoading,
      fetchCategorizedVideos,
      isVideoModalVisible,
      selectedVideo,
      handleVideoPress,
      closeVideoModal,
    }),
    [
      videos,
      loading,
      error,
      categorizedVideos,
      isCacheLoading,
      fetchVideos,
      fetchCategorizedVideos,
      isVideoModalVisible,
      selectedVideo,
      handleVideoPress,
      closeVideoModal,
    ]
  );

  return (
    <YoutubeContext.Provider value={contextValue}>
      {children}
    </YoutubeContext.Provider>
  );
};
