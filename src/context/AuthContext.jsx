import { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthToken } from "../lib/api";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "cartify-auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthToken(user?.token || null);
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          setAuthToken(null);
        }
        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  // async function login(email, password) {
  // setLoading(true);
  // try {
  // const { data } = await api.post("/auth/login", { email, password });
  // setUser(data);
  // return data;
  // } finally {
  // setLoading(false);
  // }
  // }

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuthToken(data.token);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  // async function register(payload) {
  // setLoading(true);
  // try {
  // const { data } = await api.post("/auth/register", payload);
  // setUser(data);
  // return data;
  // } finally {
  // setLoading(false);
  // }
  // }

  async function register(payload) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      setAuthToken(data.token);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }
  async function refreshProfile() {
    if (!user?.token) {
      return null;
    }

    setAuthToken(user.token);
    const { data } = await api.get("/auth/profile");
    const merged = { ...user, ...data, token: user.token };
    setUser(merged);
    return merged;
  }

  async function updateProfile(payload) {
    const { data } = await api.put("/auth/profile", payload);
    setUser(data);
    return data;
  }

  async function requestPasswordReset(payload) {
    const { data } = await api.post("/auth/forgot-password", payload);
    return data;
  }

  function logout() {
    setUser(null);
    setAuthToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        refreshProfile,
        updateProfile,
        requestPasswordReset,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
