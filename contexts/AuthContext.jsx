import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const guestLogin = () => {
    setIsLoggedIn(true);
    AsyncStorage.setItem("isLoggedIn", "true");
  };

  return (
    <AuthContext.Provider
      value={{
        guestLogin,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
