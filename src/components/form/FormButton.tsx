import React from "react";

interface FormButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

export function FormButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  fullWidth = true,
  type = "button",
}: FormButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const widthStyles = fullWidth ? "w-full" : "";

  const variantStyles = {
    primary: "btn-primary hover:-translate-y-0.5 active:translate-y-0",
    secondary: "btn-secondary hover:-translate-y-0.5 active:translate-y-0",
    outline: "border-2 border-sf-gold text-sf-gold hover:bg-sf-cream disabled:opacity-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${widthStyles} ${variantStyles[variant]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading && <span className="inline-block animate-spin">⏳</span>}
      {children}
    </button>
  );
}
