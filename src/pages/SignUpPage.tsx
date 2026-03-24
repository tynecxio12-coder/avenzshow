import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      setErrorMessage("Please agree to the Terms and Privacy Policy.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    navigate("/login");
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Join AvenzShoe for exclusive benefits
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-14 rounded-xl border border-border bg-background pl-12 pr-4 text-base outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>

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
                placeholder="Password (min. 8 characters)"
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

            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <span>
                I agree to the{" "}
                <Link to="/policy" className="text-gold hover:underline">
                  Terms and Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl gold-gradient text-primary font-bold tracking-[0.18em] uppercase text-base hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-8 text-lg">
            Already have an account?{" "}
            <Link to="/login" className="text-gold font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
