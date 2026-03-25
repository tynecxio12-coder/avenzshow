import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type UserRole = "admin" | "customer" | null;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roleLoading: boolean;
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
  const [roleLoading, setRoleLoading] = useState(false);
  const [profileRole, setProfileRole] = useState<UserRole>(null);

  const fetchProfileRole = async (userId?: string): Promise<UserRole> => {
    if (!userId) {
      setProfileRole(null);
      return null;
    }

    setRoleLoading(true);

    try {
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

      const role: UserRole = data?.role === "admin" ? "admin" : "customer";
      setProfileRole(role);
      return role;
    } catch (error) {
      console.error("Unexpected profile role error:", error);
      setProfileRole("customer");
      return "customer";
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session load error:", error.message);
        }

        if (!mounted) return;

        const currentSession = data.session ?? null;
        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);

        // Important: stop auth loading immediately
        setLoading(false);

        // Load role in background
        if (currentUser?.id) {
          fetchProfileRole(currentUser.id);
        } else {
          setProfileRole(null);
        }
      } catch (error) {
        console.error("Auth load failed:", error);
        if (!mounted) return;
        setSession(null);
        setUser(null);
        setProfileRole(null);
        setLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;

      setSession(session ?? null);
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.id) {
        fetchProfileRole(currentUser.id);
      } else {
        setProfileRole(null);
        setRoleLoading(false);
      }
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
    setRoleLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        roleLoading,
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
