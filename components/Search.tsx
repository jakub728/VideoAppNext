import React, { useContext, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Animated,
  Easing,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { YoutubeContext } from "../contexts/YoutubeContext";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Video from "./Video";

export default function Search() {
  const {
    videos,
    loading,
    error,
    fetchVideos,
    isVideoModalVisible,
    selectedVideo,
    handleVideoPress,
    closeVideoModal,
  } = useContext(YoutubeContext);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("relevance");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  //1 scroll
  const scrollViewRef = useRef<ScrollView>(null);
  const handleSearch = () => {
    if (searchText.trim() !== "") {
      fetchVideos({ query: searchText });
    }
  };
  useEffect(() => {
    if (videos && videos.length > 0) {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  }, [videos]);

  //2 spinner
  const spinValue = useRef(new Animated.Value(0)).current;
  const spin = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };
  useEffect(() => {
    if (loading) {
      spin();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [loading]);
  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const AnimatedIcon = Animated.createAnimatedComponent(EvilIcons);

  //3 sortowanie
  const handleSort = () => {
    setIsSortModalVisible(true);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  console.log("videos from YoutubeContext:", videos);

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
      <View style={styles.sort}>
        <Text onPress={handleSort}>Sort by: </Text>
        <Text>
          {(() => {
            switch (sort) {
              case "date":
                return "latest";
              case "oldest":
                return "oldest";
              case "viewCount":
                return "most popular";
              default:
                return "relevance";
            }
          })()}
        </Text>
      </View>

      {/* SORT BY MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort records by:</Text>
            <TouchableOpacity
              style={styles.sortOptionButton}
              onPress={() => {
                setSort("date");
                fetchVideos({ query: searchText, order: "date" });
                setIsSortModalVisible(false);
              }}
            >
              <Text style={styles.sortOptionText}>Upload date: latest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOptionButton}
              onPress={() => {
                setSort("oldest");
                fetchVideos({ query: searchText, order: "oldest" });
                setIsSortModalVisible(false);
              }}
            >
              <Text style={styles.sortOptionText}>Upload date: oldest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOptionButton}
              onPress={() => {
                setSort("viewCount");
                fetchVideos({ query: searchText, order: "viewCount" });
                setIsSortModalVisible(false);
              }}
            >
              <Text style={styles.sortOptionText}>Most popular</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOptionButton}
              onPress={() => {
                setSort("relevance");
                fetchVideos({ query: searchText, order: "relevance" });
                setIsSortModalVisible(false);
              }}
            >
              <Text style={styles.sortOptionText}>Relevance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOptionButton, styles.cancelButton]}
              onPress={() => setIsSortModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* YOUTUBE VIDEO MODAL */}
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

      {loading && (
        <AnimatedIcon
          name="spinner"
          size={54}
          color="black"
          style={{ transform: [{ rotate: spinInterpolate }] }}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {videos && videos.length > 0 && !loading
          ? (videos as any[]).map((video: any) => (
              <TouchableOpacity
                key={video.id.videoId}
                style={styles.videoItem}
                onPress={() => handleVideoPress(video)}
              >
                <Image
                  source={{ uri: video.snippet.thumbnails?.high?.url }}
                  style={styles.videoImage}
                />
                <View style={styles.infoRow}>
                  <Text style={styles.channelTitle}>
                    {video.snippet.channelTitle}
                  </Text>
                  <Text style={styles.publishedDate}>
                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.videoTitle}>{video.snippet.title}</Text>
              </TouchableOpacity>
            ))
          : !loading && (
              <Text style={{ textAlign: "center" }}>Search videos</Text>
            )}
      </ScrollView>
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
    width: "80%",
    color: "#000",
    marginTop: 50,
    marginBottom: 10,
  },
  scroll: {
    width: "100%",
    marginTop: 20,
  },
  scrollContent: {},
  videoItem: {
    marginVertical: 10,
    padding: 10,
    paddingTop: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    width: "100%",
  },
  errorText: {
    color: "red",
  },
  videoImage: {
    width: "90%",
    height: 200,
    marginRight: 10,
    borderRadius: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    paddingHorizontal: 5,
    marginBottom: 5,
    marginTop: 5,
  },
  channelTitle: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    flex: 1,
  },
  publishedDate: {
    fontSize: 12,
    color: "#999",
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    width: "80%",
    paddingHorizontal: 5,
    marginBottom: 15,
    textAlign: "center",
  },
  sort: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "rgba(124, 130, 184, 1)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "white",
  },
  sortOptionButton: {
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  sortOptionText: {
    fontSize: 16,
    color: "white",
  },
  cancelButton: {
    marginTop: 10,
    borderBottomWidth: 0,
    backgroundColor: "rgba(55, 61, 114, 1)",
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
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
