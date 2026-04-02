/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1fbf7",
          100: "#d9f4e9",
          500: "#1f9d74",
          600: "#18815f",
          900: "#10392d"
        },
        ink: "#172126",
        sand: "#f7f2ea",
        coral: "#ee6c4d"
      },
      boxShadow: {
        soft: "0 18px 40px rgba(23, 33, 38, 0.12)"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
