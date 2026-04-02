import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User | null, redirectPath?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("token");
      if (token) {
        await fetchUser();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api("/get-user");
      if (response.status === 200) {
        setUser(response);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };


  const login = async (token: string, user: User | null, redirectPath = "/") => {
    try {
      Cookies.set("token", token, { expires: 7 });
      navigate(redirectPath);
      setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      Cookies.remove("token");
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
