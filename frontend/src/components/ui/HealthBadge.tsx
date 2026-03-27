import React from "react";

export interface HealthBadgeProps {
  label: string;
  variant?: "default" | "success" | "warning";
  isLarge?: boolean;
}

export const HealthBadge = ({
  label,
  variant = "default",
  isLarge,
}: HealthBadgeProps) => {
  const styles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
  };

  const sizeClasses = isLarge
    ? "px-3 py-1.5 text-xs font-semibold"
    : "px-2 py-0.5 text-[10px] font-medium";

  return (
    <span
      className={`rounded-full border transition-all duration-300 ${styles[variant]} ${sizeClasses}`}
    >
      {label}
    </span>
  );
};
