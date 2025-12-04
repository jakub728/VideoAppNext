import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Text,
  Button,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
// import Video, { VideoRef } from "react-native-video";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const PLAYER_HEIGHT = width * 0.5625;

type VideoPlayerProps = {
  videoId: string;
  title: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  viewCount: string | undefined;
  likeCount: string | undefined;
  commentCount: string | undefined;
};

export default function Video({
  videoId,
  title,
  channelTitle,
  description,
  likeCount,
  viewCount,
  commentCount,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState<boolean>(false);
  const [isDetails, setIsDetails] = useState<boolean>(true);
  const playerRef = useRef<InstanceType<typeof YoutubePlayer> | null>(null);

  const activeDetailStyle = isDetails ? styles.tabActive : styles.tabInactive;
  const activeNotesStyle = !isDetails ? styles.tabActive : styles.tabInactive;

  const detailTextStyle = isDetails
    ? styles.tabTextActive
    : styles.tabTextInactive;
  const notesTextStyle = !isDetails
    ? styles.tabTextActive
    : styles.tabTextInactive;

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("End");
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

  // number formatter - accepts undefined and returns "0" when missing
  const formatViews = (value?: string): string => {
    if (!value) return "0";
    const newNumber = Number(value) || 0;

    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    });

    const formattedString = formatter.format(newNumber);
    return formattedString;
  };

  return (
    <View style={styles.container}>
      <YoutubePlayer
        ref={playerRef}
        height={PLAYER_HEIGHT}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
        webViewStyle={styles.webView}
      />

      <Text style={styles.videoTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={{ textAlign: "left", marginLeft: 20 }}>
        {formatViews(viewCount)} views
      </Text>
      <View style={styles.subcontainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10",
          }}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color="black"
            style={styles.channelLogo}
          />
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {channelTitle}
          </Text>
        </View>
      </View>

      <View style={styles.subcontainer2}>
        <View style={[styles.tabItem, activeDetailStyle]}>
          <Text onPress={() => setIsDetails(true)} style={detailTextStyle}>
            Details
          </Text>
        </View>

        <View style={[styles.tabItem, activeNotesStyle]}>
          <Text onPress={() => setIsDetails(false)} style={notesTextStyle}>
            Notes
          </Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {isDetails ? (
          <>
            <Text style={{ fontWeight: "bold" }}>Description</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </>
        ) : (
          <Text style={styles.descriptionText}>Notes</Text>
        )}
      </View>
      <View style={styles.subcontainer3}>
        <Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  subcontainer: {
    display: "flex",
    flexDirection: "row",
    margin: 15,
  },
  subcontainer2: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 5,
    borderBottomColor: "#ccc",
    paddingHorizontal: 30,
  },
  subcontainer3: {},
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: 10,
  },
  channelLogo: {
    marginRight: 10,
    backgroundColor: "rgba(55, 61, 114, 1)",
    padding: 10,
    color: "white",
    borderRadius: 50,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 15,
    color: "#333",
  },

  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    width: "50%",
  },
  tabActive: {
    borderBottomColor: "rgba(55, 61, 114, 1)",
  },
  tabInactive: {
    borderBottomColor: "rgba(180, 180, 180, 1)",
  },
  tabTextActive: {
    fontWeight: "bold",
    color: "black",
    fontSize: 15,
    textAlign: "center",
  },
  tabTextInactive: {
    fontWeight: "normal",
    color: "#666",
    fontSize: 15,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
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
