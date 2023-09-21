// authContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";

type UserCredentials = {
  username: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => void;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already authenticated (e.g., via local storage)
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }else{
        router.push("/Access/signIn")
    }
  }, []);

  const login = (credentials: UserCredentials) => {
    // Reset the error state on login attempt
    setError(null);

    // Perform your authentication logic here (e.g., validate credentials)
    if (credentials.username === "user@example.com" && credentials.password === "1Password") {
      // Authentication successful
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      router.push("/");
    } else {
      // Authentication failed
      setError("Invalid username or password");
      setIsAuthenticated(false);
      localStorage.setItem("auth", "false");
      router.push("/Access/signIn");
    }
  };

  const logout = () => {
    // Log out the user
    setIsAuthenticated(false);
    localStorage.setItem("auth", "false");
    router.push("/Access/signIn");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
