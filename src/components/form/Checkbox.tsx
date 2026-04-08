import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  hint?: string;
}

export function Checkbox({ label, checked, onChange, disabled = false, hint }: CheckboxProps) {
  return (
    <div className="space-y-1">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-5 w-5 cursor-pointer rounded border-sf-line accent-sf-gold dark:accent-yellow-500"
        />
        <span className="text-sm font-medium text-sf-ink dark:text-white">{label}</span>
      </label>
      {hint && <div className="ml-8 text-xs text-sf-muted dark:text-gray-400">{hint}</div>}
    </div>
  );
}
