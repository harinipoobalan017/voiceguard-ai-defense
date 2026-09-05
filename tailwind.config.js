/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#000000",
          card: "#121319",
          border: "rgba(255, 255, 255, 0.12)"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["BubbledotICG-FinePos", "Silkscreen", "Geist Pixel Circle", "monospace"]
      }
    },
  },
  plugins: [],
}
