import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profileRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-lg font-semibold">
        Loading admin...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (profileRole !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}
