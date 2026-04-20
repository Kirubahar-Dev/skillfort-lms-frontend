import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) {
        toast.error("Too many attempts. Wait a minute.");
      } else {
        toast.error("Unable to process request. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <style>{`
        @keyframes floatUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .card-float { animation: floatUp 0.5s ease both; }
        .btn-shimmer { background-size:200% auto; background-image:linear-gradient(90deg,#6366f1 0%,#818cf8 40%,#6366f1 100%); animation:shimmer 2.5s linear infinite; }
        .btn-shimmer:hover { background-image:linear-gradient(90deg,#4f46e5 0%,#6366f1 100%); animation:none; }
      `}</style>

      <div className="card-float w-full max-w-md rounded-3xl border bg-white/5 p-8 shadow-2xl backdrop-blur-sm dark:border-white/10">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 ring-2 ring-brand-primary/30">
            <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold">Forgot Password</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800/30 dark:bg-emerald-900/10">
            <p className="text-3xl mb-3">📬</p>
            <h2 className="font-semibold text-emerald-700 dark:text-emerald-400">Check your inbox!</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              We sent a password reset link to <strong>{email}</strong>.<br/>
              The link expires in 1 hour.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-4 text-sm text-brand-primary hover:underline"
            >
              Try a different email
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:border-white/10"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full rounded-xl py-3 font-semibold text-white shadow-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Sending...
                </>
              ) : "Send Reset Link"}
            </button>

            <div className="text-center text-sm text-slate-500">
              Remember your password?{" "}
              <Link to="/login" className="font-semibold text-brand-primary hover:underline">Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
