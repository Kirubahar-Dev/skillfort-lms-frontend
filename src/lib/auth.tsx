import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { clearTokens, getStoredTokens, getStoredUser, loginRequest, type UserInfo } from "./api";

export type Role = "admin" | "instructor" | "student";

type AuthContextValue = {
  isAuthenticated: boolean;
  user: UserInfo | null;
  userRole: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(Boolean(getStoredTokens()?.access_token));
  const [user, setUser] = useState<UserInfo | null>(getStoredUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      userRole: user?.role || null,
      login: async (email: string, password: string) => {
        const result = await loginRequest(email, password);
        setAuthenticated(true);
        setUser(result.user);
      },
      logout: () => {
        clearTokens();
        setAuthenticated(false);
        setUser(null);
      },
    }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
