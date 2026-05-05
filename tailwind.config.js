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
        primary: {
          DEFAULT: "#0F4D4A",
          dark: "#0A3D3A",
          light: "#F0FDFA",
        },
        secondary: "#52DFBB",
        accent: "#FF5A5F",
        background: "#F8FAFC",
        surface: {
          DEFAULT: "#FFFFFF",
          low: "#F1F5F9",
        },
        text: {
          main: "#0F172A",
          muted: "#64748B",
        },
        border: "#E2E8F0",
      },
      boxShadow: {
        ambient: "0 10px 30px rgba(15, 77, 74, 0.05)",
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.25rem",
        '3xl': "1.5rem",
      }
    },
  },
  plugins: [],
};