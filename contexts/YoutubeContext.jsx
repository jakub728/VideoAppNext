import React, { createContext, useState, useEffect } from "react";

export const YoutubeContext = createContext();
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

export function YoutubeProvider({ children }) {
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideos = async (options = {}) => {
    const {
      query = "React Native", //wyszukiwanie
      maxResults = 10, // liczba wynikow
      order = "relevance", // sortowanie ('date', 'viewCount', 'relevance')
      channelId = "", // ID kanału
    } = options;

    if (!API_KEY || !BASE_URL) {
      setError("Brak klucza API lub BASE URL. Sprawdź konfigurację .env");
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setVideos(data.items);
    } catch (err) {
      console.error("Błąd podczas pobierania wideo:", err);
      setError(err.message || "Nie udało się pobrać wideo.");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <YoutubeContext.Provider value={{ videos, loading, error, fetchVideos }}>
      {children}
    </YoutubeContext.Provider>
  );
}
