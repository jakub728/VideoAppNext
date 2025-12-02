import React, { useState, useCallback, useRef } from "react";
import { View, StyleSheet, Alert, Dimensions, Text } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
// import Video, { VideoRef } from "react-native-video";

const { width } = Dimensions.get("window");
const PLAYER_HEIGHT = width * 0.5625;

type VideoPlayerProps = {
  videoId: string;
  title: string;
};

export default function Video({ videoId, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  const playerRef = useRef<InstanceType<typeof YoutubePlayer> | null>(null);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Film zakończony!", "Możesz wrócić do wyników wyszukiwania.");
    }
    if (state === "cued") {
    }
  }, []);

  if (!videoId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error no videoId</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.videoTitle} numberOfLines={2}>
        {title}
      </Text>

      <YoutubePlayer
        ref={playerRef}
        height={PLAYER_HEIGHT}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
        webViewStyle={styles.webView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 15,
    marginTop: 50,
    color: "#333",
  },
  webView: {
    opacity: 0.99,
  },
  errorText: {
    padding: 20,
    color: "red",
  },
});
