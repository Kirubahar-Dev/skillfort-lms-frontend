import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../lib/auth";

export function LoginModule() {
  const { login, user, userRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("Password@123");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect after successful login based on role
  useEffect(() => {
    if (user && userRole) {
      // Redirect to role-specific dashboard
      switch (userRole) {
        case "viewer":
          navigate("/student/dashboard", { replace: true });
          break;
        case "manager":
          navigate("/instructor/dashboard", { replace: true });
          break;
        case "admin":
        case "super_admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    }
  }, [user, userRole, navigate]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError(null);
      setIsLoading(true);
      await login(email, password);
      // Auto-redirect happens via useEffect
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Invalid credentials or API unavailable");
    }
  };

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>SkillFort LMS Login</h1>
        <p className="module-subtitle">Access your learning platform. Choose your role to continue.</p>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          disabled={isLoading}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        {error ? <div className="error">{error}</div> : null}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
        <p className="login-hint">
          <small>Demo credentials: superadmin@example.com / Password@123</small>
        </p>
      </form>
    </div>
  );
}
