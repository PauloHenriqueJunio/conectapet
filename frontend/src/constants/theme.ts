/**
 * Tema centralizado do ConectaPet.
 * Este arquivo mantém apenas a paleta de cores do projeto.
 */

export const BRAND_COLORS = {
  50: "#effbf3",
  100: "#d9f5e2",
  200: "#b5eac8",
  300: "#84d8a2",
  400: "#4fbd76",
  500: "#2f9f5a",
  600: "#1f7f46",
  700: "#1a6539",
  800: "#185030",
  900: "#164228",
} as const;

export const NEUTRAL_COLORS = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827",
} as const;

export const STATUS_COLORS = {
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    600: "#16a34a",
    700: "#15803d",
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    700: "#b91c1c",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    700: "#b45309",
    950: "#78350f",
  },
  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    600: "#0284c7",
    700: "#0369a1",
  },
} as const;
