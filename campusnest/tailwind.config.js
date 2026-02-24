/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // CampusNest brand palette — mirrors src/theme/colors.ts
        cn: {
          bg: "#000000",
          card: "#1a1a1a",
          "card-alt": "#2a2a2a",
          dark: "#27272a",
          surface: "#3f3f46",
          light: "#f2f2f2",
          white: "#ffffff",
          "input-dark": "#1a1a1a",
          border: "#333333",
          "border-light": "#dddddd",
          "border-muted": "#bbbbbb",
          "text-primary": "#ffffff",
          "text-secondary": "#aaaaaa",
          "text-muted": "#999999",
          "text-dim": "#777777",
          "text-dark": "#000000",
          "text-label": "#dddddd",
          "text-subtle": "#555555",
          accent: "#3b82f6",
        },
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [],
};
