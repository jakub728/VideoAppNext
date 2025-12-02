import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

const CARD_WIDTH = 180;
const SCREEN_WIDTH = Dimensions.get("window").width;

type VideoItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails?: { high?: { url: string } };
    channelTitle: string;
  };
};

type VideoCategoryRowProps = {
  title: string;
  videos: VideoItem[];
};

export default function VideoRow({ title, videos }: VideoCategoryRowProps) {
  if (!videos || videos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noVideosText}>Brak filmów do wyświetlenia.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {videos.map((video) => (
          <View key={video.id.videoId} style={styles.card}>
            <Image
              source={{ uri: video.snippet.thumbnails?.high?.url }}
              style={styles.thumbnail}
            />
            <Text style={styles.videoTitle} numberOfLines={2}>
              {video.snippet.title}
            </Text>
            <Text style={styles.channelTitle} numberOfLines={1}>
              {video.snippet.channelTitle}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  thumbnail: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  videoTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  channelTitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  noVideosText: {
    marginLeft: 15,
    color: "#888",
  },
});
