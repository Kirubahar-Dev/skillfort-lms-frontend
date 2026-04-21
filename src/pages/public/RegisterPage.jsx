import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../services/authService";

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function strengthScore(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const STRENGTH_COLOR = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500"];

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const score = strengthScore(form.password);
  const pwMatch = form.confirm && form.password === form.confirm;
  const pwMismatch = form.confirm && form.password !== form.confirm;

  const checks = [
    { label: "At least 8 characters", ok: form.password.length >= 8 },
    { label: "One uppercase letter (A-Z)", ok: /[A-Z]/.test(form.password) },
    { label: "One lowercase letter (a-z)", ok: /[a-z]/.test(form.password) },
    { label: "One number (0-9)", ok: /\d/.test(form.password) },
  ];

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      setShake(true); setTimeout(() => setShake(false), 600);
      return;
    }
    setLoading(true);
    try {
      await register({ full_name: form.full_name, email: form.email, password: form.password });
      toast.success("Account created! Check your email.");
      navigate("/login");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail.forEach(d => toast.error(d.msg || "Validation error"));
      } else if (typeof detail === "string") {
        toast.error(detail);
      } else if (err?.response?.status === 409) {
        toast.error("Email already registered. Please login.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
      setShake(true); setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
      <style>{`
        @keyframes floatUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-8px)} 30%{transform:translateX(8px)} 45%{transform:translateX(-6px)} 60%{transform:translateX(6px)} 75%{transform:translateX(-3px)} 90%{transform:translateX(3px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .card-float { animation: floatUp 0.5s ease both; }
        .shake { animation: shake 0.6s ease; }
        .btn-shimmer { background-size:200% auto; background-image:linear-gradient(90deg,#FCB900 0%,#ffd04d 40%,#FCB900 100%); animation:shimmer 2.5s linear infinite; }
        .btn-shimmer:hover { background-image:linear-gradient(90deg,#e6a800 0%,#FCB900 100%); animation:none; }
      `}</style>

      <form onSubmit={submit} className={`card-float w-full max-w-md rounded-3xl border bg-white/5 p-8 shadow-2xl backdrop-blur-sm dark:border-white/10 ${shake ? "shake" : ""}`}>
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 ring-2 ring-brand-primary/30">
            <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold">Create Account</h1>
          <p className="mt-1 text-sm text-slate-500">Join Skillfort Institute today</p>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</label>
          <input
            required
            placeholder="Your full name"
            className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:border-white/10"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
          />
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
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 pr-11 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:border-white/10"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-brand-primary">
              <EyeIcon open={showPw} />
            </button>
          </div>

          {/* Strength bar */}
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= score ? STRENGTH_COLOR[score] : "bg-slate-200 dark:bg-white/10"}`} />
                ))}
              </div>
              <p className={`mt-1 text-xs font-medium ${score >= 4 ? "text-emerald-500" : score >= 3 ? "text-yellow-500" : "text-red-500"}`}>
                {STRENGTH_LABEL[score]}
              </p>
            </div>
          )}

          {/* Requirements checklist */}
          {form.password && (
            <ul className="mt-2 space-y-1">
              {checks.map(c => (
                <li key={c.label} className={`flex items-center gap-1.5 text-xs transition-colors ${c.ok ? "text-emerald-600" : "text-slate-400"}`}>
                  <span className="text-base leading-none">{c.ok ? "✓" : "○"}</span>
                  {c.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              placeholder="••••••••"
              className={`w-full rounded-xl border bg-transparent px-4 py-3 pr-11 text-sm outline-none transition focus:ring-2 dark:border-white/10
                ${pwMatch ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20" : pwMismatch ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-slate-200 focus:border-brand-primary focus:ring-brand-primary/20"}`}
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-brand-primary">
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {pwMatch && <p className="mt-1 text-xs text-emerald-600">✓ Passwords match</p>}
          {pwMismatch && <p className="mt-1 text-xs text-red-500">✗ Passwords do not match</p>}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="btn-shimmer w-full rounded-xl py-3 font-semibold text-slate-900 shadow-lg transition disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? (
            <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#1e293b" strokeWidth="4"/>
              <path className="opacity-75" fill="#1e293b" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>Creating account...</>
          ) : "Create Account"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-semibold text-brand-primary hover:underline" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
