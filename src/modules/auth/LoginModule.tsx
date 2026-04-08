import { FormEvent, useState } from "react";

import { useAuth } from "../../lib/auth";

export function LoginModule() {
  const { login } = useAuth();
  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("Password@123");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError(null);
      await login(email, password);
    } catch {
      setError("Invalid credentials or API unavailable");
    }
  };

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>BlastPilot Login</h1>
        <p className="module-subtitle">Secure multi-tenant access for campaign operations.</p>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <div className="error">{error}</div> : null}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
