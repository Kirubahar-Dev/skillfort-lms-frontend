/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sf: {
          ink: "#101014",
          muted: "#5f636f",
          line: "#e8e8eb",
          gold: "#f7be0a",
          goldStrong: "#dea705",
          cream: "#fff7db",
          panel: "#ffffff",
        },
      },
      boxShadow: {
        soft: "0 14px 30px rgba(8, 12, 20, 0.08)",
        glow: "0 18px 45px rgba(247, 190, 10, 0.22)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(1200px 500px at 5% -10%, rgba(247, 190, 10, 0.28), transparent 48%), radial-gradient(1100px 520px at 100% 0, rgba(255, 235, 178, 0.46), transparent 52%), linear-gradient(180deg, #fffcf1 0%, #fffaf2 42%, #f7f8fb 100%)",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};