import React, { createContext, useState } from "react";

export const YoutubeContext = createContext();

export default function YoutubeContext() {
  const [videos, setVideos] = useState({});

  return (
    <YoutubeContext.Provider value={{}}>{children}</YoutubeContext.Provider>
  );
}
