import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import Video from "./Video";
import { YoutubeContext } from "../contexts/YoutubeContext";
import VideoRow from "./VideoRow";

const CATEGORIES_TO_DISPLAY = ["REACT-NATIVE", "REACT", "TYPESCRIPT"];
const CARD_WIDTH = 180;

export default function Home() {
  const {
    categorizedVideos,
    isLoading,
    refetchCategorizedVideos,
    error,
    isVideoModalVisible,
    selectedVideo,
    closeVideoModal,
    handleVideoPress,
  } = useContext(YoutubeContext);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={() => refetchCategorizedVideos()}>
          <Text style={styles.retryButton}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      {!categorizedVideos && <Text style={styles.noDataText}>No data</Text>}

      <View style={{ height: 50 }} />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVideoModalVisible}
        onRequestClose={closeVideoModal}
      >
        {selectedVideo && (
          <Video
            videoId={selectedVideo.videoId}
            title={selectedVideo.title}
            channelTitle={selectedVideo.channelTitle}
            description={selectedVideo.description}
            publishedAt={selectedVideo.publishedAt}
            viewCount={selectedVideo.viewCount}
            likeCount={selectedVideo.likeCount}
            commentCount={selectedVideo.commentCount}
          />
        )}

        <TouchableOpacity style={styles.closeButton} onPress={closeVideoModal}>
          <Text style={styles.closeButtonText}>Back</Text>
        </TouchableOpacity>
      </Modal>
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
  closeButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(200, 200, 200, 0.7)",
    padding: 10,
    borderRadius: 20,
    zIndex: 100,
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});
