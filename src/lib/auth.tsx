import React, { createContext, useContext, useEffect, useState } from "react";
import { api, type ApiUser, getApiBaseUrl, isUsingLiveApi } from "./api";

export interface AuthContextType {
  user: ApiUser | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = () => {
    if (isUsingLiveApi()) {
      const baseUrl = getApiBaseUrl();
      window.location.href = `${baseUrl}/v1/auth/github`;
    } else {
      // Offline / dev fallback: set mock user in localStorage
      const mockUser: ApiUser = {
        id: "usr_mock_dev",
        handle: "alexdev",
        name: "Alex Rivers",
        email: "alex@example.com",
        avatarUrl: "https://avatars.githubusercontent.com/u/12345",
        createdAt: "2026-11-01T12:00:00Z",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("skillapt_mock_user", JSON.stringify(mockUser));
      }
      setUser(mockUser);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
