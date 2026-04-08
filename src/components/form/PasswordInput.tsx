import React, { useState } from "react";

interface PasswordInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  showStrength?: boolean;
}

export function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
  return { score: 4, label: "Strong", color: "bg-emerald-500" };
}

export function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  required = false,
  showStrength = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className="space-y-2">
      <label className="label-base flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`input-base w-full pr-12 ${error ? "border-red-500 focus:ring-red-500 dark:border-red-600" : "focus:ring-sf-gold dark:focus:ring-yellow-500"}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-sf-muted transition-colors hover:text-sf-ink dark:text-gray-400 dark:hover:text-white"
        >
          {showPassword ? "👁 hide" : "👁 show"}
        </button>
      </div>

      {showStrength && value && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  strength && i <= strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
          {strength && <div className="text-xs text-sf-muted dark:text-gray-400">{strength.label}</div>}
        </div>
      )}

      {error && <div className="flex items-center gap-1 text-sm text-red-500 dark:text-red-400">⚠ {error}</div>}
      {hint && !error && <div className="text-sm text-sf-muted dark:text-gray-400">{hint}</div>}
    </div>
  );
}
