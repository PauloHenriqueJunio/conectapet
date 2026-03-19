import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
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
        },
      },
    },
  },
  plugins: [],
};

export default config;
