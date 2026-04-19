import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success("If your account exists, reset link was sent.");
    } catch {
      toast.error("Unable to process request");
    }
  };

  return (
    <div className="container-wide py-14">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded-2xl border p-6 dark:border-white/10">
        <h1 className="font-heading text-3xl font-bold">Forgot Password</h1>
        <input type="email" className="w-full rounded-lg border p-2 bg-transparent" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="w-full rounded-lg bg-brand-primary py-2 font-semibold text-white">Send Reset Link</button>
      </form>
    </div>
  );
}
