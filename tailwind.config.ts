import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  "#e6f7f7",
          100: "#c0eaeb",
          200: "#8dd6d8",
          300: "#4ebfc2",
          400: "#1aa8ac",
          500: "#01969a",
          600: "#017a7e",
          700: "#015f62",
          800: "#014547",
          900: "#002d2f",
        },
        gold: {
          50:  "#fdf9e7",
          100: "#faf0c0",
          200: "#f5e08a",
          300: "#eecf55",
          400: "#e5be2a",
          500: "#D4A017",
          600: "#b08010",
          700: "#8a610b",
          800: "#654507",
          900: "#422c03",
        },
        brand: {
          teal:      "#01969a",
          "teal-dark": "#015f62",
          gold:      "#D4A017",
          "gold-light": "#f5e08a",
          white:     "#ffffff",
          offwhite:  "#f8fafa",
          light:     "#e6f7f7",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card:  "0 2px 12px 0 rgba(1,150,154,0.08)",
        panel: "0 4px 24px 0 rgba(1,150,154,0.12)",
        gold:  "0 2px 12px 0 rgba(212,160,23,0.15)",
      },
      borderRadius: {
        xl:  "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;