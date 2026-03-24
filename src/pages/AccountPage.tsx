import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AccountPage() {
  const { user, loading, signOut, session } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <p className="text-lg">Loading account...</p>
        </div>
      </Layout>
    );
  }

  if (!user || !session) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-4xl font-bold">Please Log In</h1>
          <p className="text-muted-foreground mt-3">
            You need to log in to access your account.
          </p>
          <Link
            to="/login"
            className="mt-6 px-8 py-3 gold-gradient text-primary font-semibold rounded-xl"
          >
            Sign In
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding py-12">
        <h1 className="font-display text-4xl font-bold mb-3">My Account</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back, {user.user_metadata?.full_name || user.email}
        </p>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground">Full Name</label>
              <input
                value={user.user_metadata?.full_name || ""}
                readOnly
                className="mt-2 w-full h-12 rounded-xl border border-border px-4 bg-background"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <input
                value={user.email || ""}
                readOnly
                className="mt-2 w-full h-12 rounded-xl border border-border px-4 bg-background"
              />
            </div>
          </div>

          <button
            onClick={signOut}
            className="mt-8 px-6 py-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>

          <div className="mt-6 text-xs text-muted-foreground break-all">
            <p>User ID: {user.id}</p>
            <p>Logged in: {session ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
