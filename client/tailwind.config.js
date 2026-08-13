/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        spruce: {
          DEFAULT: "#14302A",
          50: "#EAF0EE",
          100: "#CFDDD9",
          200: "#9FBAB2",
          400: "#3D6A5C",
          600: "#1E4238",
          800: "#0F241F",
          900: "#0A1815",
        },
        mist: {
          DEFAULT: "#F3F1EA",
          50: "#FBFAF7",
        },
        amber: {
          DEFAULT: "#E8A33D",
          600: "#C97F1F",
        },
        slate: {
          rock: "#4A5859",
        },
        rain: {
          DEFAULT: "#3B6E92",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        ridge:
          "linear-gradient(180deg, rgba(20,48,42,0) 0%, rgba(20,48,42,0.04) 100%)",
      },
    },
  },
  plugins: [],
};
