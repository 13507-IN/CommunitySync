"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
  type AppUser,
  type AuthSession,
} from "@/lib/auth-storage";

interface AuthContextValue {
  isAuthenticated: boolean;
  isReady: boolean;
  user: AppUser | null;
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedSession = readAuthSession();
    setSessionState(storedSession);
  }, []);

  // Sync Clerk user with our AppUser structure if needed
  const user = useMemo<AppUser | null>(() => {
    if (!clerkUser) return session?.user ?? null;
    
    return {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.username || "User",
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      role: (clerkUser.publicMetadata?.role as any) || "volunteer",
    };
  }, [clerkUser, session]);

  const setSession = (nextSession: AuthSession) => {
    writeAuthSession(nextSession);
    setSessionState(nextSession);
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
      clearAuthSession();
      setSessionState(null);
      router.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback
      clearAuthSession();
      setSessionState(null);
      router.replace("/");
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!clerkUser,
      isReady: isLoaded,
      user,
      session,
      setSession,
      signOut,
    }),
    [clerkUser, isLoaded, user, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
