import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-roboto)", "sans-serif"],
        sans:  ["var(--font-roboto)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#313131",
        meta: "#878787",
        sage: "#59815b",
        cream: "#f2f1e7",
        "footer-bg": "#32373c",
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.28em",
      },
      maxWidth: {
        "8xl": "1300px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
