import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
// Define the type for user authentication credentials
type UserCredentials = {
  username: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    // Check if the user is already authenticated (e.g., via local storage)
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (credentials: UserCredentials) => {
    // Perform your authentication logic here (e.g., validate credentials)
    if (credentials.username === "user@example.com" && credentials.password === "1Password") {
      // Authentication successful
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      router.push("/");
    } else {
      // Authentication failed
      setIsAuthenticated(false);
      localStorage.setItem("auth", "false");
      router.push("/Access/signIn");
    }
  };
   // Add the useRouter hook
  // ... (rest of the code remains the same)

  const logout = () => {
    // Log out the user
    setIsAuthenticated(false);
    localStorage.setItem("auth", "false");
    // Redirect to the sign-in page after logout
    router.push("/Access/signIn");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
