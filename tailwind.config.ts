import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fongit: {
          navy: "#142850",
          "navy-light": "#1b3a6b",
          "navy-deep": "#0f1d36",
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', "Georgia", "serif"],
        body: ['"DM Sans"', "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
