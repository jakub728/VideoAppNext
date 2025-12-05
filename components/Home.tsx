import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Video from "react-native-video";

import { YoutubeContext } from "../contexts/YoutubeContext";
import VideoRow from "./VideoRow";

import localVideoSource from "../assets/broadchurch.mp4";

const CATEGORIES_TO_DISPLAY = ["REACT-NATIVE", "REACT", "TYPESCRIPT"];
const CARD_WIDTH = 180;

export default function Home() {
  const {
    categorizedVideos,
    isCacheLoading,
    fetchCategorizedVideos,
    error,
    handleLocalVideoPress,
  } = useContext(YoutubeContext);

  useEffect(() => {
    fetchCategorizedVideos();
  }, []);

  if (isCacheLoading) {
    return <Text>Loading categories...</Text>;
  }

  console.log("categorizedVideos:", categorizedVideos);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>Courses</Text>
      {categorizedVideos &&
        CATEGORIES_TO_DISPLAY.map((categoryKey) => {
          const videos = categorizedVideos[categoryKey] || [];

          return (
            <VideoRow
              key={categoryKey}
              title={categoryKey.replace("-", " ")}
              videos={videos}
            />
          );
        })}

      {!categorizedVideos && !error && (
        <Text style={styles.noDataText}>No data</Text>
      )}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginLeft: 15,
          marginBottom: 10,
          color: "red",
        }}
      >
        LOCAL
      </Text>
      <TouchableOpacity
        onPress={handleLocalVideoPress}
        style={{ width: CARD_WIDTH, marginHorizontal: 5, marginBottom: 10 }}
      >
        <Video
          source={{ uri: localVideoSource as any }}
          style={{
            width: CARD_WIDTH,
            height: 100,
            marginLeft: 10,
            borderRadius: 8,
            marginBottom: 20,
          }}
          controls={false}
          resizeMode="contain"
          paused={true}
        />
      </TouchableOpacity>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#f9f9f9",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainHeader: {
    fontSize: 22,
    fontWeight: "900",
    marginLeft: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    marginBottom: 10,
  },
  retryButton: {
    color: "blue",
    textDecorationLine: "underline",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 50,
    color: "#aaa",
  },
});
