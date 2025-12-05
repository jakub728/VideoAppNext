import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import Video from "react-native-video";
import Ionicons from "@expo/vector-icons/Ionicons";

const PLAYER_HEIGHT = Dimensions.get("window").width * (9 / 16);

interface VideoLocalProps {
  localSource: string;
  title: string;
  channelTitle: string;
  description: string;
  viewCount?: string;
  likeCount?: string;
  publishedAt?: string;
  commentCount?: string;
  notes?: string;
}

export default function VideoLocal({
  localSource,
  title,
  channelTitle,
  description,
  viewCount,
  likeCount,
  publishedAt,
}: VideoLocalProps) {
  const [isDetails, setIsDetails] = useState(true);
  const activeDetailStyle = isDetails ? styles.tabActive : styles.tabInactive;
  const activeNotesStyle = !isDetails ? styles.tabActive : styles.tabInactive;
  const detailTextStyle = isDetails
    ? styles.tabTextActive
    : styles.tabTextInactive;
  const notesTextStyle = !isDetails
    ? styles.tabTextActive
    : styles.tabTextInactive;

  return (
    <ScrollView style={styles.container}>
      <Video
        source={{ uri: localSource }}
        style={{ width: "100%", height: PLAYER_HEIGHT, position: "static" }}
        controls={true}
        resizeMode="contain"
        paused={false}
      />

      <Text style={styles.videoTitle} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.subcontainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
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

            <View style={styles.subcontainer3}>
              <Text style={{ fontWeight: "bold", marginLeft: 30 }}>
                Statistic
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    marginLeft: 30,
                    padding: 10,
                    width: "30%",
                    textAlign: "center",
                    backgroundColor: "rgba(55, 61, 114, 1)",
                    color: "white",
                    borderRadius: 15,
                  }}
                >
                  {viewCount} views
                </Text>
                <Text
                  style={{
                    marginRight: 30,
                    padding: 10,
                    width: "30%",
                    textAlign: "center",
                    backgroundColor: "rgba(55, 61, 114, 1)",
                    color: "white",
                    borderRadius: 15,
                  }}
                >
                  {likeCount} likes
                </Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={{ fontWeight: "bold" }}>Notes</Text>
        )}
      </View>
    </ScrollView>
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
    marginVertical: 30,
  },
});
