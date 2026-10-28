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
        background: "#FBFBFA",
        surface: "#FFFFFF",
        "surface-warm": "#F6F6F2",
        "surface-subtle": "#EDEDE8",
        border: "#E5E5DE",
        "border-subtle": "#EDEDE6",
        charcoal: {
          900: "#111215",
          800: "#1A1B20",
          700: "#272930",
          600: "#3F424E",
          500: "#606474",
          400: "#868B9E",
          300: "#B3B7C6",
          200: "#DFE2EA",
          100: "#F1F2F6",
        },
        lime: {
          brand: "#D2FC36",
          hover: "#C3F01E",
          dark: "#A3D405",
          muted: "#EBFDB1",
          subtle: "#F6FEE2",
        },
        accent: {
          red: "#E5484D",
          amber: "#F59E0B",
          emerald: "#10B981",
          blue: "#2563EB",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        card: "0 2px 8px -2px rgba(17, 18, 21, 0.05), 0 1px 3px 0 rgba(17, 18, 21, 0.04)",
        dropdown: "0 10px 25px -5px rgba(17, 18, 21, 0.08), 0 8px 10px -6px rgba(17, 18, 21, 0.04)",
        limeGlow: "0 0 20px -3px rgba(210, 252, 54, 0.4)",
      },
      borderRadius: {
        pill: "9999px",
      }
    },
  },
  plugins: [],
};
export default config;

