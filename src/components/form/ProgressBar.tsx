import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium text-sf-muted">{label}</div>}
      <div className="w-full h-2 bg-sf-line rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sf-gold to-sf-goldStrong rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-sf-muted text-right">
        Step {current} of {total} • {Math.round(percentage)}%
      </div>
    </div>
  );
}
