/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#0078D4",
          secondary: "#00A400",
          background: "#ffffff",
          text: "#333333",
        },
        dark: {
          primary: "#1DA1F2",
          secondary: "#181818",
          background: "#101010",
          text: "#4d4d4d",
        },
      },
    },
  },
  plugins: [],
};

