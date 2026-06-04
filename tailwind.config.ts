import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Gradient class names (from-*/via-*/to-*) live in these data files, so
    // they must be scanned or Tailwind will purge them.
    "./data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          darkest: "#081C15",
          dark: "#1B4332",
          DEFAULT: "#2D6A4F",
          highland: "#2D6A4F",
        },
        mist: "#52B788",
        mint: "#95D5B2",
        fog: "#D8F3DC",
        neutralgray: "#757575",
        softgray: "#BDBDBD",
        // Semantic state — a warm earthy red that stays distinct from the
        // forest greens. `DEFAULT` for light surfaces, `light` for dark ones.
        danger: {
          DEFAULT: "#C0392B",
          light: "#F4978E",
        },
      },
      fontFamily: {
        // Body: Lato. Headings (font-display): Josefin Sans. Both self-hosted via next/font.
        sans: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "forest-gradient": "linear-gradient(135deg, #081C15 0%, #2D6A4F 100%)",
      },
      boxShadow: {
        card: "0 4px 24px -8px rgba(8, 28, 21, 0.18)",
        "card-hover": "0 12px 40px -12px rgba(8, 28, 21, 0.32)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-down": "fade-down 0.2s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
