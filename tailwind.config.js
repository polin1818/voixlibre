/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // Slate 900 (Professionnel/Sobre)
        accent: "#2563eb",  // Blue 600 (Confiance)
        danger: "#dc2626",  // Red 600 (Urgence)
      },
    },
  },
  plugins: [],
}