const AUTH_TOKEN_KEY = "alchemax_jwt_token";
const AUTH_USER_KEY = "alchemax_auth_user";

let memoryToken: string | null = (() => {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
})();

export const AuthTokenStore = {
  getToken(): string | null {
    if (!memoryToken) {
      try {
        memoryToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
      } catch {
        return null;
      }
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
