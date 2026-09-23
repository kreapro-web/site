/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html", "./projets/*.html", "./demos/*.html", "./guides/*.html", "./_dev/*.html", "./src/**/*.js", "./assets/js/*.js"],
  theme: {
    extend: {
      colors: {
        cream: "#F3F9D2",
        "tea-green": "#C9E4A6",
        "willow-green": "#C0D684",
        "midnight-violet": "#3D0B37",
        "blackberry-cream": "#63264A",
        ink: "#1A1A1A",
      },
      fontFamily: {
        heading: ["Poppins", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      boxShadow: {
        soft: "0 20px 45px -18px rgba(61, 11, 55, 0.18), 0 8px 18px -12px rgba(61, 11, 55, 0.10)",
        "soft-lg": "0 28px 60px -18px rgba(61, 11, 55, 0.26), 0 12px 24px -12px rgba(61, 11, 55, 0.14)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
