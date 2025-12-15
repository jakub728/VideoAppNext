import React, { createContext, useState, FC, ReactNode } from "react";
import {
  type VideoItem,
  type SelectedVideoType,
  type CategorizedVideos,
  type YoutubeContextType,
} from "../types/all";
import { useQuery } from "@tanstack/react-query";

const API_KEY: string | undefined = process.env.API_KEY;
const BASE_URL: string | undefined = process.env.BASE_URL;
const CATEGORIES: string[] = ["REACT-NATIVE", "REACT", "TYPESCRIPT"];
const VIDEOS_PER_CATEGORY: number = 5;

export interface YoutubeProviderProps {
  children: ReactNode;
}

export const YoutubeContext = createContext<YoutubeContextType>({
  videos: [],
  isLoading: false,
  error: null,
  refetchCategorizedVideos: async () => {},
  categorizedVideos: null,
  isVideoModalVisible: false,
  selectedVideo: null,
  handleVideoPress: () => {},
  closeVideoModal: () => {},
  handleLocalVideoPress: () => {},
});

// Pobieranie statystyk (wspólne)
async function fetchStatisticsForVideos(
  videoIds: string[],
  apiKey: string | undefined,
) {
  if (!apiKey || videoIds.length === 0) return {};
  const STATS_URL = `${BASE_URL?.replace("search", "videos")}?part=statistics&id=${videoIds.join(",")}&key=${apiKey}`;
  const response = await fetch(STATS_URL);
  const data = await response.json();
  if (!response.ok || data.error)
    throw new Error(data.error?.message || "Błąd statystyk");
  const statsMap: Record<string, VideoItem["statistics"]> = {};
  data.items?.forEach((item: any) => {
    if (item.id && item.statistics) statsMap[item.id] = item.statistics;
  });
  return statsMap;
}

// 1. Logika pobierania dla ekranu HOME
const fetchAllCategorizedVideos = async (): Promise<CategorizedVideos> => {
  if (!API_KEY || !BASE_URL) throw new Error("Brak kluczy API");
  const newCategorizedVideos: CategorizedVideos = {};
  let allVideoIds: string[] = [];

  for (const category of CATEGORIES) {
    const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(category)}&type=video&maxResults=${VIDEOS_PER_CATEGORY}&order=viewCount&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok || data.error)
      throw new Error(data.error?.message || "Błąd API");
    const items = (data.items as VideoItem[]) || [];
    newCategorizedVideos[category] = items;
    items.forEach((item) => {
      if (item.id?.videoId) allVideoIds.push(item.id.videoId);
    });
  }

  if (allVideoIds.length > 0) {
    const statsMap = await fetchStatisticsForVideos(allVideoIds, API_KEY);
    for (const category in newCategorizedVideos) {
      newCategorizedVideos[category] = newCategorizedVideos[category].map(
        (video) => ({
          ...video,
          statistics: statsMap[video.id.videoId] || video.statistics,
        }),
      );
    }
  }
  return newCategorizedVideos;
};

// 2. Logika dynamicznego pobierania dla ekranu SEARCH
const fetchSearchVideos = async (
  query: string,
  order: string,
): Promise<VideoItem[]> => {
  if (!API_KEY || !BASE_URL) throw new Error("Brak kluczy API");
  if (!query) return [];

  const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&order=${order}&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.error)
    throw new Error(data.error?.message || "Błąd wyszukiwania");

  const items = (data.items as VideoItem[]) || [];
  const videoIds = items
    .map((item) => item.id?.videoId)
    .filter(Boolean) as string[];

  if (videoIds.length > 0) {
    const statsMap = await fetchStatisticsForVideos(videoIds, API_KEY);
    return items.map((video) => ({
      ...video,
      statistics: statsMap[video.id.videoId] || video.statistics,
    }));
  }
  return items;
};

export const YoutubeProvider: FC<YoutubeProviderProps> = ({ children }) => {
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideoType | null>(
    null,
  );

  // Dynamiczne parametry wyszukiwania sterujące zapytaniem useQuery
  const [searchParams, setSearchParams] = useState({
    query: "",
    order: "relevance",
  });

  // Zapytanie ekranu HOME (Kategorie)
  const {
    data: categorizedVideos,
    isLoading: isHomeLoading,
    error: homeError,
    refetch: refetchHome,
  } = useQuery({
    queryKey: ["categorizedVideos"],
    queryFn: fetchAllCategorizedVideos,
    staleTime: 1000 * 60 * 60,
  });

  // Zapytanie ekranu SEARCH (Dynamiczne: odpala się AUTOMATYCZNIE, gdy zmienia się searchParams)
  const {
    data: searchVideos,
    isLoading: isSearchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["searchVideos", searchParams],
    queryFn: () => fetchSearchVideos(searchParams.query, searchParams.order),
    enabled: searchParams.query !== "", // Nie szukaj na pustym stringu
    staleTime: 1000 * 60 * 5, // Wyniki wyszukiwania świeże przez 5 minut
  });

  // Mostek spełniający interfejs przekazywania parametrów w Search.tsx
  const handleTriggerSearch = async (options?: {
    query?: string;
    order?: string;
  }) => {
    if (options?.query !== undefined) {
      setSearchParams((prev) => ({
        query: options.query ?? prev.query,
        order: options.order ?? prev.order,
      }));
    } else {
      await refetchHome();
    }
  };

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

  const handleLocalVideoPress = () => {
    setSelectedVideo({
      localSource: require("../assets/broadchurch.mp4"),
      title: "Broadchurch",
      channelTitle: "Local Movies",
      publishedAt: new Date().toISOString(),
      description: "Description",
      viewCount: "9.5k",
      likeCount: "1.2k",
      commentCount: "150",
      videoId: "",
    });
    setIsVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalVisible(false);
    setSelectedVideo(null);
  };

  const combinedError = homeError || searchError;

  return (
    <YoutubeContext.Provider
      value={{
        videos: searchVideos ?? [],
        isLoading: isHomeLoading || isSearchLoading,
        error: combinedError ? (combinedError as Error).message : null,
        refetchCategorizedVideos: handleTriggerSearch,
        isVideoModalVisible,
        selectedVideo,
        handleVideoPress,
        closeVideoModal,
        handleLocalVideoPress,
        categorizedVideos: categorizedVideos ?? null,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};
