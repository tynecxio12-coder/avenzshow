import Layout from "../components/layout/Layout";
import { useAuth } from "../contexts/AuthContext";

export default function AccountPage() {
  const { user, session, signOut } = useAuth();

  return (
    <Layout>
      <div className="section-padding py-12">
        <h1 className="font-display text-4xl font-bold mb-3">My Account</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back, {user?.user_metadata?.full_name || user?.email}
        </p>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground">Full Name</label>
              <input
                value={user?.user_metadata?.full_name || ""}
                readOnly
                className="mt-2 w-full h-12 rounded-xl border border-border px-4 bg-background"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <input
                value={user?.email || ""}
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
            <p>User ID: {user?.id}</p>
            <p>Logged in: {session ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
