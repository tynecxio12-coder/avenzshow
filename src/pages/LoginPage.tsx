import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, user, profileRole, loading, roleLoading, refreshProfileRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (loading || roleLoading) return;
    if (!user) return;

    if (profileRole === "admin") {
      navigate("/admin/orders", { replace: true });
    } else if (profileRole === "customer") {
      navigate("/account", { replace: true });
    }
  }, [user, profileRole, loading, roleLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const { data, error } = await signIn(email, password);

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    if (!data.session?.user) {
      setErrorMessage("Login succeeded but no session was created.");
      setSubmitting(false);
      return;
    }

    const role = await refreshProfileRole(data.session.user.id);

    if (role === "admin") {
      navigate("/admin/orders", { replace: true });
    } else {
      navigate("/account", { replace: true });
    }

    setSubmitting(false);
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
              disabled={submitting}
              className="w-full h-14 rounded-xl gold-gradient text-primary font-bold tracking-[0.18em] uppercase text-base hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting ? "Signing In..." : "Sign In"}
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
