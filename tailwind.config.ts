import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === PRIMARY BLACKS ===
        black: {
          DEFAULT: "#0B0B0B",
          true: "#0B0B0B",
          panel: "#111111",
          card: "#141414",
        },
        // === CRIMSON ===
        crimson: {
          DEFAULT: "#8B0000",
          deep: "#5A0A0A",
          accent: "#8B0000",
          button: "#7A0E0E",
          glow: "#2B0000",
        },
        // === GOLD (LOCKED) ===
        gold: {
          DEFAULT: "#D4AF37",
          highlight: "#D4AF37",
          mid: "#B8962E",
          shadow: "#8C6B1F",
        },
        // === ACCENTS ===
        ember: {
          DEFAULT: "#FF6A00",
          light: "#FF8C42",
        },
        // === TEXT ===
        white: {
          DEFAULT: "#EAEAEA",
          dim: "rgba(234, 234, 234, 0.6)",
        },
        // === FEATHER ===
        feather: {
          base: "#1A1A1A",
          shadow: "#0B0B0B",
          highlight: "#2A2A2A",
        },
        // Legacy compatibility
        charcoal: "#1A1A1D",
      },
      fontFamily: {
        display: ["Cinzel", "Times New Roman", "serif"],
        body: ["Cormorant Garamond", "Georgia", "serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-breathe": {
          "0%, 100%": { 
            filter: "brightness(1)",
            textShadow: "0 0 20px rgba(212, 175, 55, 0.1)",
          },
          "50%": { 
            filter: "brightness(1.05)",
            textShadow: "0 0 30px rgba(212, 175, 55, 0.2)",
          },
        },
        "smoke-drift": {
          "0%": { transform: "translateX(0) translateY(0)" },
          "50%": { transform: "translateX(30px) translateY(-20px)" },
          "100%": { transform: "translateX(0) translateY(0)" },
        },
        "ember-float": {
          "0%": { transform: "translateY(100vh) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-10vh) scale(1)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "glow-breathe": "glow-breathe 5s ease-in-out infinite",
        "smoke-drift": "smoke-drift 25s ease-in-out infinite",
        "ember-float": "ember-float 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
