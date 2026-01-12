/**
 * Authentication utilities and context.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAuthToken, clearAuthToken } from "./api";
import type { User } from "./types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access auth context.
 *
 * @returns Auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

/**
 * Auth provider component.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from stored token
    const initAuth = () => {
      const token = getAuthToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return {
            id: payload.user_id,
            email: payload.email,
          };
        } catch (error) {
          console.error("Failed to decode token:", error);
          clearAuthToken();
          return null;
        }
      }
      return null;
    };

    const userData = initAuth();
    setUser(userData);
    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    clearAuthToken();
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
