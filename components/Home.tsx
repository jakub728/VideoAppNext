import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { YoutubeContext } from "../contexts/YoutubeContext";
import VideoRow from "./VideoRow";

const CATEGORIES_TO_DISPLAY = ["REACT-NATIVE", "REACT", "TYPESCRIPT"];

export default function Home() {
  const { categorizedVideos, isCacheLoading, fetchCategorizedVideos, error } =
    useContext(YoutubeContext);

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
        <Text style={styles.noDataText}>
          No data
        </Text>
      )}
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
