const AUTH_TOKEN_KEY = "alchemax_jwt_token";
const AUTH_USER_KEY = "alchemax_auth_user";
const REFRESH_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutos antes de expirar

interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  rol?: string;
  usuarioId?: number;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

let memoryToken: string | null = (() => {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
})();

export const AuthTokenStore = {
  isTokenExpired(token?: string | null): boolean {
    const target = token ?? memoryToken;
    if (!target) return true;
    const payload = decodeJwtPayload(target);
    if (!payload || typeof payload.exp !== "number") {
      return false;
    }
    return payload.exp * 1000 <= Date.now();
  },

  shouldRefreshToken(token?: string | null): boolean {
    const target = token ?? AuthTokenStore.getToken();
    if (!target) return false;
    const payload = decodeJwtPayload(target);
    if (!payload || typeof payload.exp !== "number") {
      return false;
    }
    const remainingMs = payload.exp * 1000 - Date.now();
    return remainingMs > 0 && remainingMs <= REFRESH_THRESHOLD_MS;
  },

  getToken(): string | null {
    if (!memoryToken) {
      try {
        memoryToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
      } catch {
        return null;
      }
    }
    if (memoryToken && AuthTokenStore.isTokenExpired(memoryToken)) {
      AuthTokenStore.clear();
      return null;
    }
    return memoryToken;
  },

  setToken(token: string): void {
    memoryToken = token;
    try {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      // Fallback to in-memory token if sessionStorage is unavailable
    }
  },

  clear(): void {
    memoryToken = null;
    try {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // Ignore storage errors
    }
  },

  getUserRaw(): string | null {
    try {
      return sessionStorage.getItem(AUTH_USER_KEY);
    } catch {
      return null;
    }
  },

  setUserRaw(serialized: string): void {
    try {
      sessionStorage.setItem(AUTH_USER_KEY, serialized);
    } catch {
      // Ignore storage errors
    }
  },
};
