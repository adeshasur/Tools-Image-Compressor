/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cloud: "#f8f6f1",
        ink: "#111111",
        gold: "#c7a554",
        mist: "#ebe5d6"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(15, 23, 42, 0.12)",
        soft: "0 18px 50px rgba(255, 255, 255, 0.18) inset, 0 16px 40px rgba(15, 23, 42, 0.08)",
        tile: "0 18px 40px rgba(15, 23, 42, 0.1)"
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.26) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.26) 1px, transparent 1px)"
      }
    },
  },
  plugins: [],
}
