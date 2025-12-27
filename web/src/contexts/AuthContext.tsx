import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { User } from "@/types";
import { apiFetch, clearAccessToken, getAccessToken, setAccessToken } from "@/lib/api";
import { ApiUser, mapApiUser } from "@/lib/mappers";

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUsers: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type LoginResponse = {
  access_token: string;
  token_type: "bearer";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUsers = async () => {
    try {
      const apiUsers = await apiFetch<ApiUser[]>("/api/v1/users", { method: "GET" });
      setUsers(apiUsers.map(mapApiUser));
    } catch {
      setUsers([]);
    }
  };

  const fetchMe = async () => {
    const me = await apiFetch<ApiUser>("/api/v1/auth/me", { method: "GET" });
    setUser(mapApiUser(me));
  };

  useEffect(() => {
    const boot = async () => {
      setIsLoading(true);
      try {
        const token = getAccessToken();
        if (!token) {
          setUser(null);
          setUsers([]);
          return;
        }
        await fetchMe();
        await refreshUsers();
      } catch {
        clearAccessToken();
        setUser(null);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    boot();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiFetch<LoginResponse>("/api/v1/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email, password }),
      });
      setAccessToken(res.access_token);
      await fetchMe();
      await refreshUsers();
      return true;
    } catch {
      clearAccessToken();
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
    setUsers([]);
  };

  const value = useMemo<AuthContextType>(
    () => ({ user, users, login, logout, refreshUsers, isLoading }),
    [user, users, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

