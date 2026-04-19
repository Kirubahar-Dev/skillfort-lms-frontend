/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6C63FF",
          secondary: "#FF6584",
          dark: "#0F0F1A",
          code: "#12122A",
        },
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        body: ["Outfit", "sans-serif"],
        code: ["JetBrains Mono", "monospace"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSlow: "pulse 3s ease-in-out infinite",
        gradient: "gradient 12s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
