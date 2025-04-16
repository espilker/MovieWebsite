// src/contexts/AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from "react";
import {
  createRequestToken,
  createSessionWithLogin,
  createSession,
  getAccountDetails,
  deleteSession,
} from "../services/api";
import { AuthContext, AuthContextType } from "./AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const sessionId = localStorage.getItem("tmdb_session_id");
    if (sessionId) {
      setIsLoading(true);
      getAccountDetails(sessionId)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Invalid session, remove it
          localStorage.removeItem("tmdb_session_id");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create a request token
      const { request_token } = await createRequestToken();

      // Step 2: Validate the request token with login credentials
      await createSessionWithLogin(username, password, request_token);

      // Step 3: Create a session with the validated request token
      const { session_id } = await createSession(request_token);

      // Step 4: Get account details
      const userData = await getAccountDetails(session_id);

      // Save the session ID and user data
      localStorage.setItem("tmdb_session_id", session_id);
      setUser(userData);
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const sessionId = localStorage.getItem("tmdb_session_id");

    if (sessionId) {
      try {
        await deleteSession(sessionId);
      } catch (err) {
        console.error("Logout error:", err);
      }
    }

    localStorage.removeItem("tmdb_session_id");
    setUser(null);
    setIsLoading(false);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
