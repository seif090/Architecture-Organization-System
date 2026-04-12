import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api, setAuthToken } from "../api";
import type { AuthResponse, Role, User } from "../types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Exclude<Role, "admin">) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "erp_token";
const USER_KEY = "erp_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    setAuthToken(response.data.token);
  };

  const register = async (name: string, email: string, password: string, role: Exclude<Role, "admin">) => {
    const response = await api.post<AuthResponse>("/auth/register", { name, email, password, role });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    setAuthToken(response.data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth context is not available");
  }
  return context;
}
