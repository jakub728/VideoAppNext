import React, { createContext, useState, FC, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isLoggedIn: boolean;
  guestLogin: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  guestLogin: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
