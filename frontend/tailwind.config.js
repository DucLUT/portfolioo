/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        melanzane: '#270413',
        turkishRose: '#b36c7c',
        monarch: '#77082c',
        mulberryWood: '#490422',
        asphalt: '#0b0404',
        venus: '#8f868b',
        martinique: '#443856',
        judgeGray: '#564636',
        mountbattenPink: '#937c8c',
        haiti: '#231243',
        primaryColor: "var(--color-primary)",
        secondaryColor: "var(--color-secondary)",
        accentColor: "var(--color-accent)",
        accentSecondaryColor: "var(--color-accent-secondary)",
        accentTertiaryColor: "var(--color-accent-tertiary)",
        outerBorderColor: "var(--color-outer-border)",
        innerBorderColor: "var(--color-inner-border)",
        connectedColor: "var(--color-connected)",
        disconnectedColor: "var(--color-disconnected)",
        titleColorPrimary: "var(--color-title-primary)",
        titleColorSecondary: "var(--color-title-secondary)",
        textBoldColor: "var(--color-text-bold)",
        textLightColor: "var(--color-text-light)",
        borderColorPrimary: "var(--color-border-primary)",
        borderColorSecondary: "var(--color-border-secondary)",
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },

      animation: {
        "spin-slow": "spin 2s linear infinite",
    },
    },
  },
  plugins: [],
}