/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5", // A deep indigo/purple for main elements
          dark: "#3730A3", // A darker shade for text/hover
          light: "#EEF2FF", // A very light shade for backgrounds
        },
        accent: {
          DEFAULT: "#F97316", // A vibrant orange for highlights
          light: "#FFEDD5", // A lighter shade for accents
        },
        cardBg: {
          purple: "#F3F4FF", // Light purple for service card
          green: "#F0FFF4", // Light green for service card
          pink: "#FFF0F5", // Light pink for service card
        },
      },
    },
  },
  plugins: [],
}
