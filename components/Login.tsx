import { StyleSheet, Text, View, Button } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";

export default function Login() {
  const { guestLogin, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    console.log("isLoggedIn changed", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login Screen</Text>
      <Button
        title="Log In as guest"
        onPress={() => guestLogin()}
        color="#2196F3"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
  },
  button: {
    fontSize: 18,
    textDecorationLine: "underline",
  },
});
