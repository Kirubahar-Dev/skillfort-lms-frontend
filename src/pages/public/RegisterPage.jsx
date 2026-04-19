import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../services/authService";

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await register({ full_name: form.full_name, email: form.email, password: form.password });
      toast.success("Check your email for verification details");
      navigate("/login");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="container-wide py-14">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded-2xl border p-6 dark:border-white/10">
        <h1 className="font-heading text-3xl font-bold">Register</h1>
        <input className="w-full rounded-lg border p-2 bg-transparent" placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input className="w-full rounded-lg border p-2 bg-transparent" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full rounded-lg border p-2 bg-transparent" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input type="password" className="w-full rounded-lg border p-2 bg-transparent" placeholder="Confirm Password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        <button className="w-full rounded-lg bg-brand-primary py-2 font-semibold text-white">Create Account</button>
        <p className="text-center text-sm">Already have an account? <Link className="text-brand-primary" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
