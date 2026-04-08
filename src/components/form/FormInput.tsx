import React from "react";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
}

export function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon,
  disabled = false,
  required = false,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="label-base flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-sf-muted dark:text-gray-400">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`input-base w-full ${icon ? "pl-10" : ""} ${error ? "border-red-500 focus:ring-red-500 dark:border-red-600" : "focus:ring-sf-gold dark:focus:ring-yellow-500"}`}
        />
      </div>
      {error && <div className="flex items-center gap-1 text-sm text-red-500 dark:text-red-400">⚠ {error}</div>}
      {hint && !error && <div className="text-sm text-sf-muted dark:text-gray-400">{hint}</div>}
    </div>
  );
}
