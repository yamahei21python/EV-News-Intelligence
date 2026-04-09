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
        background: "#050505",
        foreground: "#f7f8f8",
        brand: {
          emerald: "#3ecf8e",
          link: "#00c573",
        },
        ui: {
          panel: "#0f1011",
          marketing: "#08090a",
          muted: "#62666d",
          secondary: "#d0d6e0",
        },
        premium: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          glass: "rgba(255, 255, 255, 0.03)",
          border: "rgba(255, 255, 255, 0.08)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
