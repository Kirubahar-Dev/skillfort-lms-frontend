import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { login as loginService } from "../../services/authService";
import { getRoleHomePath, useAuth } from "../../context/AuthContext";

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [eyeAnimate, setEyeAnimate] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const pwRef = useRef(null);

  const toggleEye = () => {
    setEyeAnimate(true);
    setShowPw((v) => !v);
    setTimeout(() => setEyeAnimate(false), 400);
    pwRef.current?.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginService(form);
      localStorage.setItem("skillfort-access-token", data.access_token);
      login(data.user);
      toast.success(`Welcome back, ${data.user.full_name}!`);
      navigate(getRoleHomePath(data.user.role));
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail || err?.response?.data?.error;
      if (status === 429) {
        toast.error("Too many attempts. Please wait a minute.");
      } else if (status === 401) {
        toast.error("Invalid email or password.");
      } else if (status === 403) {
        toast.error(detail || "Account deactivated. Contact support.");
      } else {
        toast.error(detail || "Login failed. Please try again.");
      }
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-8px)}
          30%{transform:translateX(8px)}
          45%{transform:translateX(-6px)}
          60%{transform:translateX(6px)}
          75%{transform:translateX(-3px)}
          90%{transform:translateX(3px)}
        }
        @keyframes eyeBlink {
          0%{transform:scaleY(1)}
          30%{transform:scaleY(0.1)}
          60%{transform:scaleY(1.2)}
          100%{transform:scaleY(1)}
        }
        @keyframes eyePulse {
          0%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)}
          70%{box-shadow:0 0 0 8px rgba(99,102,241,0)}
          100%{box-shadow:0 0 0 0 rgba(99,102,241,0)}
        }
        @keyframes floatUp {
          from{opacity:0;transform:translateY(24px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes shimmer {
          0%{background-position:200% center}
          100%{background-position:-200% center}
        }
        .card-float { animation: floatUp 0.5s ease both; }
        .shake { animation: shake 0.6s ease; }
        .eye-blink { animation: eyeBlink 0.4s ease; }
        .eye-pulse { animation: eyePulse 0.5s ease; }
        .btn-shimmer {
          background-size: 200% auto;
          background-image: linear-gradient(90deg, #6366f1 0%, #818cf8 40%, #6366f1 100%);
          animation: shimmer 2.5s linear infinite;
        }
        .btn-shimmer:hover { background-image: linear-gradient(90deg, #4f46e5 0%, #6366f1 100%); animation: none; }
      `}</style>

      <form
        onSubmit={onSubmit}
        className={`card-float w-full max-w-md rounded-3xl border bg-white/5 p-8 shadow-2xl backdrop-blur-sm dark:border-white/10 ${shake ? "shake" : ""}`}
      >
        {/* Brand mark */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 ring-2 ring-brand-primary/30">
            <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your Skillfort account</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:border-white/10"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password with eye toggle */}
        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
          <div className="relative">
            <input
              ref={pwRef}
              type={showPw ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 pr-12 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:border-white/10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={toggleEye}
              className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:text-brand-primary ${eyeAnimate ? "eye-pulse" : ""}`}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              <span className={eyeAnimate ? "eye-blink inline-block" : "inline-block"}>
                <EyeIcon open={showPw} />
              </span>
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label className="mb-5 flex items-center gap-2.5 text-sm text-slate-500 select-none cursor-pointer">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-brand-primary" />
          Remember Me
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-shimmer relative w-full overflow-hidden rounded-xl py-3 font-semibold text-white shadow-lg transition disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Signing in...
            </span>
          ) : "Login"}
        </button>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link className="text-brand-primary hover:underline" to="/forgot-password">Forgot Password?</Link>
          <Link className="text-brand-primary hover:underline" to="/register">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
