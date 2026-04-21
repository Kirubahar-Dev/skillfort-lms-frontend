import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (pwd !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await resetPassword(searchParams.get("token") || "", pwd);
      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Reset failed");
    }
  };

  return (
    <div className="container-wide py-14">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded-2xl border p-6 dark:border-white/10">
        <h1 className="font-heading text-3xl font-bold">Reset Password</h1>
        <input type="password" className="w-full rounded-lg border p-2 bg-transparent" placeholder="New Password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        <input type="password" className="w-full rounded-lg border p-2 bg-transparent" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button className="w-full rounded-lg bg-brand-primary py-2 font-semibold text-slate-900">Update Password</button>
      </form>
    </div>
  );
}
