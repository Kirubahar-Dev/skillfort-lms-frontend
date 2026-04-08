import { FormEvent, ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import { AnimatedPage } from "../../components/common/AnimatedPage";
import { PageHero } from "../../components/common/PageHero";

function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <AnimatedPage>
      <PageHero kicker="Authentication" title={title} description={description} />
      <section className="mx-auto w-full max-w-xl panel">{children}</section>
    </AnimatedPage>
  );
}

export function LoginPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <AuthShell title="Login" description="Sign in to access your student dashboard and purchased courses.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="label-base">
          Email
          <input className="input-base mt-1" required type="email" placeholder="you@example.com" />
        </label>
        <label className="label-base">
          Password
          <input className="input-base mt-1" required type="password" placeholder="********" />
        </label>
        <button type="submit" className="btn-primary w-full">
          Login
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center justify-between text-sm text-sf-muted">
        <Link to="/forgot-password" className="underline">
          Forgot password?
        </Link>
        <Link to="/signup" className="underline">
          New user? Signup
        </Link>
      </div>
      {sent ? <p className="mt-3 text-sm text-emerald-700">Mock login successful for frontend flow.</p> : null}
    </AuthShell>
  );
}

export function SignupPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <AuthShell title="Signup" description="Create a learner account to purchase and access recorded sessions.">
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="label-base">
          Full Name
          <input className="input-base mt-1" required placeholder="Your full name" />
        </label>
        <label className="label-base">
          Email
          <input className="input-base mt-1" required type="email" placeholder="you@example.com" />
        </label>
        <label className="label-base">
          Mobile Number
          <input className="input-base mt-1" required type="tel" placeholder="+91" />
        </label>
        <label className="label-base">
          Password
          <input className="input-base mt-1" required type="password" placeholder="********" />
        </label>
        <button type="submit" className="btn-primary w-full">
          Create Account
        </button>
      </form>
      <p className="mt-3 text-sm text-sf-muted">
        Already registered? <Link className="underline" to="/login">Login here</Link>
      </p>
      {sent ? <p className="mt-3 text-sm text-emerald-700">Account created. Proceed to OTP verification.</p> : null}
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <AuthShell title="Forgot Password" description="Request a reset link or OTP for your Skillfort account.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="label-base">
          Registered Email
          <input className="input-base mt-1" required type="email" placeholder="you@example.com" />
        </label>
        <button type="submit" className="btn-primary w-full">
          Send Reset Link
        </button>
      </form>
      {sent ? <p className="mt-3 text-sm text-emerald-700">Reset instructions sent to your email.</p> : null}
    </AuthShell>
  );
}

export function OtpVerificationPage() {
  const [verified, setVerified] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVerified(true);
  };

  return (
    <AuthShell title="OTP Verification" description="Verify your mobile/email OTP to activate account access.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="label-base">
          OTP Code
          <input className="input-base mt-1" required placeholder="Enter 6 digit OTP" maxLength={6} />
        </label>
        <button type="submit" className="btn-primary w-full">
          Verify OTP
        </button>
      </form>
      <p className="mt-3 text-sm text-sf-muted">Did not receive OTP? Resend in 00:24</p>
      {verified ? <p className="mt-3 text-sm text-emerald-700">OTP verified. Account is now active.</p> : null}
    </AuthShell>
  );
}