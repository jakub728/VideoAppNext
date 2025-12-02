import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const STORAGE_KEY = "@CategorizedVideosCache";
const CATEGORIES = ["REACT-NATIVE", "REACT", "TYPESCRIPT"];
const VIDEOS_PER_CATEGORY = 5;

export const YoutubeContext = createContext({
  videos: {},
  loading: false,
  error: null,
  fetchVideos: () => {},

  categorizedVideos: null,
  isCacheLoading: false,
  fetchCategorizedVideos: () => {},
});

export function YoutubeProvider({ children }) {
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categorizedVideos, setCategorizedVideos] = useState(null);
  const [isCacheLoading, setIsCacheLoading] = useState(false);

  // Save to AsyncStorage
  const saveVideosToStorage = async (data) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log("Data saved in AsyncStorage");
    } catch (e) {
      console.error("Error writing to AsyncStorage:", e);
    }
  };

  // Load from AsyncStorage
  const loadVideosFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        const storedData = JSON.parse(jsonValue);
        console.log("Data loaded from AsyncStorage");
        return storedData;
      }
      return null;
    } catch (e) {
      console.error("Error reading AsyncStorage:", e);
      return null;
    }
  };

  //! Fetch Home videos
  const fetchCategorizedVideos = async () => {
    setIsCacheLoading(true);
    setError(null);

    const cachedData = await loadVideosFromStorage();
    if (cachedData) {
      setCategorizedVideos(cachedData);
      setIsCacheLoading(false);
      return cachedData;
    }

    if (!API_KEY || !BASE_URL) {
      const msg = "No API key or BASE_URL BASE URL";
      setError(msg);
      setIsCacheLoading(false);
      return;
    }

    const newCategorizedVideos = {};
    let allSucceeded = true;

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

        newCategorizedVideos[category] = data.items || [];
      } catch (err) {
        console.error(
          `Error loading categories (fetchCategorizedVideos) ${category}:`,
          err
        );
        newCategorizedVideos[category] = [];
        allSucceeded = false;
        setError(err.message || "Not possible to load all categories");
        break;
      }
    }
    if (allSucceeded && Object.keys(newCategorizedVideos).length > 0) {
      await saveVideosToStorage(newCategorizedVideos);
      setCategorizedVideos(newCategorizedVideos);
    } else if (allSucceeded) {
      setCategorizedVideos(newCategorizedVideos);
    }

    setIsCacheLoading(false);
  };

  //! Fetch Search videos
  const fetchVideos = async (options = {}) => {
    const {
      query = "React Native", //wyszukiwanie
      maxResults = 10, // liczba wynikow
      order = "relevance", // sortowanie ('date', 'viewCount', 'relevance')
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

    if (channelId) {
      url += `&channelId=${channelId}`;
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg =
          errorData.error?.message || `HTTP Error: ${response.status}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();

      setVideos(data.items);
    } catch (err) {
      console.error("Error loading videos (fetchVideos):", err);
      setError(err.message || "Error loading videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YoutubeContext.Provider
      value={{
        videos,
        loading,
        error,
        fetchVideos,
        categorizedVideos,
        isCacheLoading,
        fetchCategorizedVideos,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
}
