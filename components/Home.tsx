import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { YoutubeContext } from "../contexts/YoutubeContext";

type YoutubeVideoItem = {
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
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
};

export default function Home() {
  const { videos, loading, error, fetchVideos } = useContext(YoutubeContext);
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      fetchVideos({ query: searchText });
    }
  };

  console.log("videos in Home:", videos);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="React Native"
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
      />
      <Button title="Search" onPress={handleSearch} color="#FF0000" />

      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {videos && videos.length > 0
        ? videos.map((video: YoutubeVideoItem) => (
            <View key={video.id.videoId} style={styles.videoItem}>
              <Text style={styles.videoTitle}>{video.snippet.title}</Text>
            </View>
          ))
        : !loading && <Text>No videos found.</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "80%",
    color: "#000",
  },
  videoItem: {
    marginVertical: 10,
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    width: "100%",
  },
  errorText: {
    color: "red",
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
