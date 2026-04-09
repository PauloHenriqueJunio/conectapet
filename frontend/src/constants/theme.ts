/**
 * Tema centralizado do ConectaPet
 * Todas as cores, variáveis CSS e constantes de estilo estão aqui
 */

// ============================================
// CORES BRAND (Verde principal)
// ============================================
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

// ============================================
// CORES NEUTRAS (Cinza - Slate)
// ============================================
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

// ============================================
// CORES DE STATUS
// ============================================
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

// ============================================
// COMBINAÇÕES PRÉ-DEFINIDAS
// ============================================
export const COLOR_COMBINATIONS = {
  // Inputs e forms
  input: {
    bg: "bg-slate-50",
    border: "border-slate-300",
    text: "text-slate-900",
    focus:
      "focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20",
  },

  // Cards e containers neutros
  card: {
    bg: "bg-white",
    border: "border-slate-200",
    shadow: "shadow-sm",
  },

  // Buttons primários (brand)
  buttonPrimary: {
    bg: "bg-brand-600",
    text: "text-white",
    hover: "hover:bg-brand-700",
    focus: "focus:ring-2 focus:ring-brand-500/50",
  },

  // Buttons secundários (outline brand)
  buttonSecondary: {
    bg: "bg-transparent",
    border: "border-brand-300",
    text: "text-brand-700",
    hover: "hover:bg-brand-50",
  },

  // Badges de status
  badgeSuccess: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  badgeDanger: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  badgeWarning: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },

  // Headers e navegação
  header: {
    bg: "bg-gradient-to-r from-white/95 via-white/90 to-brand-50/85",
    border: "border-white/50",
  },

  // Texto e tipografia
  text: {
    primary: "text-slate-900",
    secondary: "text-slate-700",
    tertiary: "text-slate-600",
    muted: "text-slate-500",
    light: "text-slate-400",
  },

  // Links
  link: {
    default: "text-emerald-600 hover:text-emerald-700",
    brand: "text-brand-700 hover:text-brand-800",
  },
} as const;

// ============================================
// UTILIDADES CSS CLASSES
// ============================================
export const SHADOW_CLASSES = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  inner: "shadow-inner",
} as const;

export const BORDER_RADIUS = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
} as const;

export const TRANSITIONS = {
  default: "transition",
  fast: "transition-all duration-200",
  normal: "transition-all duration-300",
  slow: "transition-all duration-500",
} as const;

// ============================================
// ATALHOS DE COMPOSIÇÃO DE CLASSES
// ============================================
export const CARD_BASE =
  "rounded-xl bg-white border border-slate-200 shadow-sm";

export const BUTTON_BASE =
  "rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none";

export const INPUT_BASE =
  "rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

export const HEADER_BASE =
  "sticky top-0 z-50 w-full border-b bg-gradient-to-r from-white/95 via-white/90 to-brand-50/85 shadow-sm backdrop-blur-xl";

// ============================================
// VARIÁVEIS DE LAYOUT
// ============================================
export const Z_INDEX = {
  dropdown: "z-50",
  modal: "z-50",
  tooltip: "z-40",
  sticky: "z-30",
} as const;

export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

// ============================================
// TIPOGRAFIA
// ============================================
export const FONT_SIZES = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
} as const;

export const FONT_WEIGHTS = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
} as const;

// ============================================
// RESPONSIVIDADE
// ============================================
export const BREAKPOINTS = {
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
  "2xl": "2xl:",
} as const;

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Combina múltiplas classes de forma segura
 */
export const combineClasses = (
  ...classes: (string | undefined | null)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Retorna classes para um button baseado no tipo
 */
export const getButtonClasses = (
  variant: "primary" | "secondary" | "danger" = "primary",
): string => {
  const base = BUTTON_BASE;

  switch (variant) {
    case "primary":
      return combineClasses(
        base,
        COLOR_COMBINATIONS.buttonPrimary.bg,
        COLOR_COMBINATIONS.buttonPrimary.text,
        COLOR_COMBINATIONS.buttonPrimary.hover,
      );
    case "secondary":
      return combineClasses(
        base,
        COLOR_COMBINATIONS.buttonSecondary.bg,
        COLOR_COMBINATIONS.buttonSecondary.border,
        COLOR_COMBINATIONS.buttonSecondary.text,
        COLOR_COMBINATIONS.buttonSecondary.hover,
      );
    case "danger":
      return combineClasses(base, "bg-red-600 text-white hover:bg-red-700");
    default:
      return base;
  }
};

/**
 * Retorna classes para um badge baseado no status
 */
export const getBadgeClasses = (
  variant: "success" | "danger" | "warning" | "default" = "default",
): string => {
  switch (variant) {
    case "success":
      return combineClasses(
        COLOR_COMBINATIONS.badgeSuccess.bg,
        COLOR_COMBINATIONS.badgeSuccess.text,
        "border",
        COLOR_COMBINATIONS.badgeSuccess.border,
        "rounded-full px-3 py-1 text-xs font-semibold",
      );
    case "danger":
      return combineClasses(
        COLOR_COMBINATIONS.badgeDanger.bg,
        COLOR_COMBINATIONS.badgeDanger.text,
        "border",
        COLOR_COMBINATIONS.badgeDanger.border,
        "rounded-full px-3 py-1 text-xs font-semibold",
      );
    case "warning":
      return combineClasses(
        COLOR_COMBINATIONS.badgeWarning.bg,
        COLOR_COMBINATIONS.badgeWarning.text,
        "border",
        COLOR_COMBINATIONS.badgeWarning.border,
        "rounded-full px-3 py-1 text-xs font-semibold",
      );
    default:
      return combineClasses(
        "bg-slate-100 text-slate-700 border border-slate-200",
        "rounded-full px-3 py-1 text-xs font-semibold",
      );
  }
};

/**
 * Retorna classes para um input baseado no tipo
 */
export const getInputClasses = (error?: boolean): string => {
  if (error) {
    return combineClasses(
      "rounded-lg border-2 border-red-500 bg-red-50 px-4 py-2.5 text-red-900 outline-none",
      "focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-500/20",
    );
  }
  return INPUT_BASE;
};
