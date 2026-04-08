const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

type TokenPair = {
  access_token: string;
  refresh_token: string;
};

export type JWTPayload = {
  sub: string;
  type: string;
  iat: number;
  exp: number;
  email?: string;
  organization_id?: string;
  role?: string;
};

const TOKENS_KEY = "blastpilot_tokens";
const USER_KEY = "skillfort_user";

/**
 * Decode JWT token without verification (for frontend use only)
 * Note: This does NOT verify the signature, so it's unsafe for security decisions
 * Use only to read claims. Server will validate the token.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}

export type UserInfo = {
  id: string;
  email: string;
  role: string;
  organization_id: string;
};

export function extractUserFromToken(token: string): UserInfo | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.sub || !payload.role) {
    return null;
  }
  return {
    id: payload.sub,
    email: payload.email || "",
    role: payload.role,
    organization_id: payload.organization_id || "",
  };
}

export function getStoredUser(): UserInfo | null {
  const value = localStorage.getItem(USER_KEY);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as UserInfo;
  } catch {
    return null;
  }
}

export function storeUser(user: UserInfo): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function getStoredTokens(): TokenPair | null {
  const value = localStorage.getItem(TOKENS_KEY);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as TokenPair;
  } catch {
    return null;
  }
}

export function storeTokens(tokens: TokenPair): void {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function clearTokens(): void {
  localStorage.removeItem(TOKENS_KEY);
  clearUser();
}

async function request(path: string, init: RequestInit = {}, retryOnAuth = true): Promise<Response> {
  const tokens = getStoredTokens();
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (tokens?.access_token) {
    headers.set("Authorization", `Bearer ${tokens.access_token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  if (response.status === 401 && retryOnAuth && tokens?.refresh_token) {
    const refreshed = await refreshToken(tokens.refresh_token);
    if (refreshed) {
      return request(path, init, false);
    }
  }

  return response;
}

// Mock credentials for testing (when backend is not available)
const MOCK_USERS: Record<string, { password: string; role: string; name: string }> = {
  "admin@skillfort.com": { password: "Admin@123", role: "admin", name: "Admin User" },
  "mentor@skillfort.com": { password: "Mentor@123", role: "manager", name: "Arjun Prakash" },
  "student@skillfort.com": { password: "Student@123", role: "viewer", name: "Student User" },
  "superadmin@example.com": { password: "Password@123", role: "super_admin", name: "Super Admin" },
};

function generateMockToken(userId: string, email: string, role: string): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      email,
      organization_id: "skillfort",
      role,
      iat: now,
      exp: now + 3600,
      type: "access",
    })
  );
  const signature = btoa("mock-signature");
  return `${header}.${payload}.${signature}`;
}

export async function loginRequest(email: string, password: string): Promise<TokenPair & { user: UserInfo }> {
  // Check mock credentials first (for testing without backend)
  const mockUser = MOCK_USERS[email.toLowerCase()];
  if (mockUser && mockUser.password === password) {
    const userId = `user_${email.split("@")[0]}`;
    const accessToken = generateMockToken(userId, email, mockUser.role);
    const refreshToken = generateMockToken(userId, email, "refresh");

    const tokenPair: TokenPair = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    storeTokens(tokenPair);

    const user: UserInfo = {
      id: userId,
      email,
      role: mockUser.role,
      organization_id: "skillfort",
    };

    storeUser(user);
    return { ...tokenPair, user };
  }

  // Try real auth endpoints
  const endpoints = [
    `${API_BASE_URL}/auth-test/login`,
    `${API_BASE_URL}/auth/login`,
  ];

  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = (await response.json()) as TokenPair;
        storeTokens(data);

        const user = extractUserFromToken(data.access_token);
        if (user) {
          storeUser(user);
          return { ...data, user };
        }

        throw new Error("Failed to extract user info from token");
      }

      if (response.status === 401) {
        throw new Error("Invalid email or password");
      }

      lastError = new Error(`Login endpoint failed: ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError || new Error("Invalid email or password");
}

export async function refreshToken(refresh_token: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) {
    clearTokens();
    return false;
  }

  const data = (await response.json()) as TokenPair;
  storeTokens(data);

  // Re-extract user info from new access token
  const user = extractUserFromToken(data.access_token);
  if (user) {
    storeUser(user);
  }

  return true;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await request(path, { method: "GET" });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, payload: unknown): Promise<T> {
  const response = await request(path, { method: "POST", body: JSON.stringify(payload) });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}
