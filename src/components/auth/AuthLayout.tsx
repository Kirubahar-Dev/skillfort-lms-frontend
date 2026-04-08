import React from "react";
import { BrandLogo } from "../common/BrandLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sf-cream via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative background elements - Light mode */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sf-gold/10 rounded-full blur-3xl -z-10 dark:hidden" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 dark:hidden" />

      {/* Decorative background elements - Dark mode */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -z-10 hidden dark:block" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 hidden dark:block" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="text-5xl">🎓</div>
          </div>
          <h1 className="mb-2 text-3xl font-semibold leading-tight text-sf-ink dark:text-white">
            {title}
          </h1>
          <p className="text-sf-muted dark:text-gray-400">{subtitle}</p>
        </div>

        {/* Main Content Panel - Glass effect */}
        <div className="space-y-6 rounded-2xl border border-sf-line bg-white/95 p-8 shadow-soft backdrop-blur dark:border-gray-700 dark:bg-gray-800/95">
          {children}
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-sf-muted dark:text-gray-400">
          <p>© 2024 SkillFort. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
