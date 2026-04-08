import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { FormInput } from "../../components/form/FormInput";
import { PasswordInput } from "../../components/form/PasswordInput";
import { Checkbox } from "../../components/form/Checkbox";
import { FormButton } from "../../components/form/FormButton";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const validateForm = () => {
    let isValid = true;
    setEmailError(undefined);
    setPasswordError(undefined);

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!validateForm()) return;

    try {
      setLoading(true);
      await login(email, password);
      // Auto-redirect happens via useAuth hook
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your learning account">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3 dark:border-red-900 dark:bg-red-950">
            <span className="text-red-600 dark:text-red-400">⚠</span>
            <div>
              <p className="font-medium text-red-900 dark:text-red-200">{error}</p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">Please check your credentials and try again.</p>
            </div>
          </div>
        )}

        {/* Email Field */}
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          error={emailError}
          icon="📧"
          required
        />

        {/* Password Field */}
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          error={passwordError}
          required
        />

        {/* Remember Me + Forgot Password */}
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me for 30 days" checked={rememberMe} onChange={setRememberMe} />
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <FormButton type="submit" loading={loading}>
          Sign In
        </FormButton>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sf-line" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-sf-muted">Or continue with</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-sf-line rounded-lg hover:bg-sf-cream transition-colors"
          >
            <span>🔵</span> Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-sf-line rounded-lg hover:bg-sf-cream transition-colors"
          >
            <span>⚫</span> GitHub
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-sm text-sf-muted">
          New to SkillFort?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
