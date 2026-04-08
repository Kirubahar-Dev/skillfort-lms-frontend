const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

type TokenPair = {
  access_token: string;
  refresh_token: string;
};

const TOKENS_KEY = "blastpilot_tokens";

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

export async function loginRequest(email: string, password: string): Promise<TokenPair> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = (await response.json()) as TokenPair;
  storeTokens(data);
  return data;
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
