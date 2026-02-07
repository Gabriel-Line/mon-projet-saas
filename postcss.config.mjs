
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // C'est ici le changement
    autoprefixer: {},
  },
};

export default config;