import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type UserRole = "admin" | "customer" | null;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileRole: UserRole;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfileRole: (userId?: string) => Promise<UserRole>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileRole, setProfileRole] = useState<UserRole>(null);

  const fetchProfileRole = async (userId?: string): Promise<UserRole> => {
    if (!userId) {
      setProfileRole(null);
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Profile role load error:", error.message);
      setProfileRole("customer");
      return "customer";
    }

    const role = data?.role === "admin" ? "admin" : "customer";
    setProfileRole(role);
    return role;
  };

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session load error:", error.message);
      }

      if (!mounted) return;

      const currentSession = data.session ?? null;
      const currentUser = currentSession?.user ?? null;

      setSession(currentSession);
      setUser(currentUser);

      if (currentUser?.id) {
        await fetchProfileRole(currentUser.id);
      } else {
        setProfileRole(null);
      }

      if (!mounted) return;
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, session);

      if (!mounted) return;

      const currentUser = session?.user ?? null;

      setSession(session ?? null);
      setUser(currentUser);

      if (currentUser?.id) {
        await fetchProfileRole(currentUser.id);
      } else {
        setProfileRole(null);
      }

      if (!mounted) return;
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        },
      },
    });
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfileRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        profileRole,
        signUp,
        signIn,
        signOut,
        refreshProfileRole: fetchProfileRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
