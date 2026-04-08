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
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-5 h-5 accent-sf-gold cursor-pointer rounded border-sf-line"
        />
        <span className="text-sm font-medium text-sf-ink">{label}</span>
      </label>
      {hint && <div className="text-xs text-sf-muted ml-8">{hint}</div>}
    </div>
  );
}
