import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";
import { Octicons } from "@expo/vector-icons";

export default function Login() {
  const { guestLogin, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    console.log("isLoggedIn changed", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <View style={styles.section20} />

      <View style={[styles.section10, styles.centerContent]}>
        <Text style={styles.youtube}>YouTube</Text>
        <Text style={styles.learn}>LEARN</Text>
      </View>
      <View style={styles.section20} />
      <View style={[styles.section40, styles.centerContent]}>
        <Octicons name="video" size={100} color="#32383dff" />
      </View>
      <View style={styles.section20}>
        <Text style={styles.welcomeText}>
          Welcome to the best YouTube-based learning application.
        </Text>
      </View>
      <View style={[styles.section20, styles.centerContent]}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => guestLogin()}
        >
          <Text style={styles.buttonText}>Log In as guest</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section10, styles.centerContent]}>
        <Text style={styles.policyText}>
          By continuing you agree with{" "}
          <Text
            style={styles.linkText}
            onPress={() => Linking.openURL("https://terms.com")}
          >
            Terms and Conditions
          </Text>{" "}
          and{" "}
          <Text
            style={styles.linkText}
            onPress={() => Linking.openURL("https://privacy.com")}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>

      <View style={styles.section10} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(124, 130, 184, 1)",
    paddingHorizontal: "10%",
  },

  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  section10: {
    flex: 1,
  },
  section20: {
    flex: 2,
  },
  section40: {
    flex: 4,
  },

  youtube: {
    fontSize: 48,
    paddingRight: 20,
    fontWeight: "bold",
    color: "white",
  },
  learn: {
    fontSize: 30,
    paddingLeft: 130,
    fontWeight: "900",
    color: "#32383dff",
  },
  welcomeText: {
    marginTop: 10,
    textAlign: "left",
    fontSize: 26,
    color: "white",
  },

  buttonContainer: {
    backgroundColor: "#32383dff",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },

  policyText: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
  linkText: {
    textDecorationLine: "underline",
    fontWeight: "bold",
    color: "#32383dff",
  },
});
