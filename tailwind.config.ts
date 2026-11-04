import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        unicaba: {
          pink: "#9b114d",
          purple: "#581c87",
          dark: "#1e1b4b",
          blue: "#1d4ed8",
          teal: "#0d9488",
          amber: "#d97706",
          red: "#dc2626"
        }
      },
    },
  },
  plugins: [],
};
export default config;
