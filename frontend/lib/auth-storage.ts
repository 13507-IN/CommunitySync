export type AppUserRole = "ngo" | "volunteer" | "govt" | "admin";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AppUser;
}

const AUTH_STORAGE_KEY = "communitysync.auth";

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function writeAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
