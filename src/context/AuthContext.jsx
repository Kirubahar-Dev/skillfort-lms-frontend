import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function getRoleHomePath(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "instructor") return "/instructor/dashboard";
  if (role === "student") return "/my-dashboard";
  return "/";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("skillfort-user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("skillfort-user", JSON.stringify(user));
    else localStorage.removeItem("skillfort-user");
  }, [user]);

  const login = (payload) => setUser(payload);
  const logout = () => {
    localStorage.removeItem("skillfort-access-token");
    localStorage.removeItem("skillfort-user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: Boolean(user) }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
