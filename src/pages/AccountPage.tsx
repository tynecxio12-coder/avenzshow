import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (user) {
      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "";
      setFullName(name);
    } else {
      setFullName("");
    }
  }, [user]);

  if (loading) {
    return (
      <section className="section-padding py-16 min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          <div className="text-lg">Loading account...</div>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <section className="section-padding py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-3">
            My Account
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, {fullName || "User"}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm mb-2 text-muted-foreground">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                readOnly
                className="w-full h-14 rounded-2xl border border-border bg-background px-4 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={user.email || ""}
                readOnly
                className="w-full h-14 rounded-2xl border border-border bg-background px-4 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-2xl border border-red-300 px-6 h-14 text-red-500 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>

          <div className="mt-8 text-sm text-muted-foreground space-y-1">
            <p>User ID: {user.id}</p>
            <p>Logged in: Yes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
