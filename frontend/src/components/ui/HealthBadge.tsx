import React from "react";
import { NEUTRAL_COLORS, STATUS_COLORS } from "@/constants/theme";

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
  const styleByVariant: Record<
    NonNullable<HealthBadgeProps["variant"]>,
    React.CSSProperties
  > = {
    default: {
      backgroundColor: NEUTRAL_COLORS[100],
      color: NEUTRAL_COLORS[700],
      borderColor: NEUTRAL_COLORS[200],
    },
    success: {
      backgroundColor: STATUS_COLORS.success[50],
      color: STATUS_COLORS.success[700],
      borderColor: STATUS_COLORS.success[200],
    },
    warning: {
      backgroundColor: STATUS_COLORS.warning[50],
      color: STATUS_COLORS.warning[700],
      borderColor: STATUS_COLORS.warning[200],
    },
  };

  const sizeClasses = isLarge
    ? "px-3 py-1.5 text-xs font-semibold"
    : "px-2 py-0.5 text-[10px] font-medium";

  return (
    <span
      className={`rounded-full border transition-all duration-300 ${sizeClasses}`}
      style={styleByVariant[variant]}
    >
      {label}
    </span>
  );
};
