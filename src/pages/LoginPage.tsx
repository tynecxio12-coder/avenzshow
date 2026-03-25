import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await signIn(email, password);

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.session?.user) {
      setErrorMessage("Login succeeded but no session was created.");
      setLoading(false);
      return;
    }

    const userId = data.session.user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Profile role fetch error:", profileError.message);
    }

    if (profile?.role === "admin") {
      navigate("/admin/orders", { replace: true });
    } else {
      navigate("/account", { replace: true });
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Sign in to your AvenzShoe account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 rounded-xl border border-border bg-background pl-12 pr-4 text-base outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>

            <div className="relative">
              <Lock className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 rounded-xl border border-border bg-background pl-12 pr-12 text-base outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl gold-gradient text-primary font-bold tracking-[0.18em] uppercase text-base hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-8 text-lg">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gold font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
