/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Noto Serif", "Georgia", "serif"],
      },
      colors: {
        background: "#F8FAFC",
        primary: "#0F766E",
        secondary: "#64748B",
        accent: "#14B8A6",
        border: "#E2E8F0",
        surface: {
          low: "#F1F5F9",
          lowest: "#E2E8F0",
        }
      },
      boxShadow: {
        ambient: "0 10px 30px rgba(15, 118, 110, 0.05)",
      },
      borderRadius: {
        xl: "1rem",
      }
    },
  },
  plugins: [],
};