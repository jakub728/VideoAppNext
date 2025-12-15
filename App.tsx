import { StyleSheet } from "react-native";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { YoutubeProvider } from "./contexts/YoutubeContext";
import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./components/Login";
import Home from "./components/Home";
import Search from "./components/Search";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function TabsScreen() {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarActiveTintColor: "#32383dff",
        tabBarInactiveTintColor: "white",
        tabBarStyle: { backgroundColor: "rgba(124, 130, 184, 1)" },
      })}
    >
      <Tab.Screen
        name="index"
        component={Home}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <YoutubeProvider>
          <RootNavigator />
        </YoutubeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? <TabsScreen /> : <Login />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(124, 130, 184, 1)",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins",
  },
});
