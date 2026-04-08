import React from "react";
import { BrandLogo } from "../common/BrandLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sf-cream via-white to-blue-50 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sf-gold/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="text-5xl">🎓</div>
          </div>
          <h1 className="hero-title text-3xl text-sf-ink mb-2">{title}</h1>
          <p className="text-sf-muted">{subtitle}</p>
        </div>

        {/* Main Content Panel */}
        <div className="panel bg-white rounded-2xl shadow-soft border border-sf-line border-t-4 border-t-sf-gold p-8 space-y-6">
          {children}
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 text-sm text-sf-muted">
          <p>© 2024 SkillFort. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
