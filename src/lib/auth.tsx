import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { clearTokens, getStoredTokens, loginRequest } from "./api";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(Boolean(getStoredTokens()?.access_token));

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login: async (email: string, password: string) => {
        await loginRequest(email, password);
        setAuthenticated(true);
      },
      logout: () => {
        clearTokens();
        setAuthenticated(false);
      },
    }),
    [isAuthenticated]
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
