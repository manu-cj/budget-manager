import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1C1C1E", // Noir profond pour les éléments clés
          light: "#2C2C2E", // Gris anthracite pour les fonds sombres
          dark: "#000000", // Noir pur pour le contraste maximal
        },
        secondary: {
          DEFAULT: "#F5FFFF", // Blanc cassé pour les fonds élégants
          light: "#FFFFFF", // Blanc pur pour les zones lumineuses
          dark: "#E5E5E5", // Gris doux pour les bordures ou arrière-plans discrets
        },
        accent: {
          DEFAULT: "#008C9E", // Turquoise profond pour boutons, liens et détails interactifs
          light: "#5FD1CF", // Turquoise clair et rafraîchissant pour hover ou accents
          dark: "#006875", // Turquoise foncé pour un contraste marqué
        },
        success: {
          DEFAULT: "#3BB273", // Vert doux et élégant pour succès
          light: "#7FD9A4", // Vert clair pour hover ou accents
          dark: "#2A874D", // Vert foncé pour contrastes
        },
        danger: {
          DEFAULT: "#E63946", // Rouge sobre et élégant pour erreurs
          light: "#F1999C", // Rouge clair pour hover ou accents
          dark: "#A62834", // Rouge sombre pour zones critiques
        },
        text: {
          DEFAULT: "#E5E5E5", // Noir profond pour les textes principaux
          light: "#F5F5F5", // Blanc cassé pour les textes sur fonds sombres
          muted: "#8E8E93", // Gris doux pour les sous-titres ou textes secondaires
        },
        background: {
          DEFAULT: "#F5F5F5", // Blanc cassé pour une base douce et lumineuse
          dark: "#1C1C1E", // Noir profond pour les sections contrastées
        },
      },

      animation: {
        slideLeft: "slideLeft 0.5s ease-in-out",
        slideRight: "slideRight 0.5s ease-in-out",
      },
      keyframes: {
        slideLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
