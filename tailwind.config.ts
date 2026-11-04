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
        brand: {
          blue: "#0077c8",
          sky: "#0ea5e9",
          cyan: "#00b4d8",
          navy: "#0a2240",
          dark: "#061527",
          magenta: "#e60067",
          pink: "#f43f5e",
          light: "#f0f7fc",
        }
      },
    },
  },
  plugins: [],
};
export default config;
