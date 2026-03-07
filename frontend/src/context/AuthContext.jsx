import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

const isValidJwtToken = (token) => {
  if (!token || token === "undefined" || token === "null") return false;
  return token.split(".").length === 3;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem("token");
  if (initialToken && !isValidJwtToken(initialToken)) {
    localStorage.removeItem("token");
  }

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    isValidJwtToken(initialToken) ? initialToken : null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data?.data?.user || null);
    } catch (error) {
      console.error("Failed to load user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { user, token } = response.data?.data || {};

    if (!user || !token) {
      throw new Error("Invalid login response from server");
    }

    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);

    return user;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const { user, token } = response.data?.data || {};

    if (!user || !token) {
      throw new Error("Invalid registration response from server");
    }

    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);

    return user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
