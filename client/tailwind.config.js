/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          background: "#ffffff",
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

