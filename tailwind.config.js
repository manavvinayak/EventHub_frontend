/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#fefce8", // A deep indigo/purple for main elements
          dark: "#3730A3", // A darker shade for text/hover
          light: "#fed7aa", // A very light shade for backgrounds
        },
        accent: {
          DEFAULT: "#9D5088", // A vibrant purple
          light: "#F4EBCE", // A lighter shade for accents
        },
        cardBg: {
          amber: "#fffbeb",
          royal: "#b97e50",
          purple: "#9D5088",
          green: "#F0FFF4", // Light green for service card
          pink: "#FFF0F5", // Light pink for service card
          brown: "#AF7839",
        },
        button: {
          purple: "#835681",
        }
      },
    },
  },
  plugins: [],
}
