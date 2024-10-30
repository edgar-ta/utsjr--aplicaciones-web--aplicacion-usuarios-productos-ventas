import type { Config } from "tailwindcss";
import defaultConfig from "tailwindcss/defaultConfig"
import resolveConfig from "tailwindcss/resolveConfig"

const fullDefaultConfig = resolveConfig(defaultConfig);

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      spacing: {
        "margin-x": "10%"
      },
      fontFamily: {
        heading: "var(--font-family--cormorant)",
        text: "var(--font-family--inter)",
        label: "var(--font-family--poppins)",
      }
    },
  },
  plugins: [],
};
export default config;
