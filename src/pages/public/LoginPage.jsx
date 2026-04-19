import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { login as loginService } from "../../services/authService";
import { getRoleHomePath, useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginService(form);
      localStorage.setItem("skillfort-access-token", data.access_token);
      login(data.user);
      toast.success("Login successful");
      navigate(getRoleHomePath(data.user.role));
    } catch {
      toast.error("Unable to login. Check credentials.");
    }
  };

  return (
    <div className="container-wide py-14">
      <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded-2xl border p-6 dark:border-white/10">
        <h1 className="font-heading text-3xl font-bold">Login</h1>
        <input type="email" required placeholder="Email" className="w-full rounded-lg border p-2 bg-transparent" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" required placeholder="Password" className="w-full rounded-lg border p-2 bg-transparent" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Remember Me</label>
        <button className="w-full rounded-lg bg-brand-primary py-2 font-semibold text-white">Login</button>
        <div className="flex items-center justify-between text-sm">
          <Link className="text-brand-primary hover:underline" to="/forgot-password">Forgot Password?</Link>
          <Link className="text-brand-primary hover:underline" to="/register">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
