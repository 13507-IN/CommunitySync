import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
  type AppUser,
  type AppUserRole,
  type AuthSession,
} from "@/lib/auth-storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000/api";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginResponse {
  user: AppUser;
  accessToken: string;
  refreshToken: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: AppUserRole;
  location?: string;
  phone?: string;
  skills?: string[];
}

interface LoginPayload {
  email: string;
  password: string;
}

interface CreateReportPayload {
  title: string;
  description: string;
  category:
    | "infrastructure"
    | "health"
    | "environment"
    | "safety"
    | "education"
    | "social"
    | "other";
  urgency: "low" | "medium" | "high";
  location: string;
  address?: string;
  images?: string[];
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || payload?.message || "Request failed");
  }

  return payload.data as T;
}

export async function registerUser(input: RegisterPayload) {
  return request<AppUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: LoginPayload): Promise<AuthSession> {
  const data = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  };
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const currentSession = readAuthSession();
  const data = await request<{ accessToken: string; refreshToken: string }>(
    "/auth/refresh",
    {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }
  );

  if (!currentSession) {
    throw new Error("No existing session found");
  }

  const nextSession = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: currentSession.user,
  };

  writeAuthSession(nextSession);
  return nextSession;
}

export async function logoutUser(refreshToken: string) {
  try {
    await request<void>(
      "/auth/logout",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }
    );
  } finally {
    clearAuthSession();
  }
}

export async function createReport(input: CreateReportPayload) {
  const session = readAuthSession();

  if (!session?.accessToken) {
    throw new Error("Please log in before submitting a report");
  }

  try {
    return await request("/reports", {
      method: "POST",
      body: JSON.stringify(input),
    }, session.accessToken);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";

    if (message.toLowerCase().includes("expired")) {
      const refreshedSession = await refreshSession(session.refreshToken);
      return request("/reports", {
        method: "POST",
        body: JSON.stringify(input),
      }, refreshedSession.accessToken);
    }

    throw error;
  }
}
