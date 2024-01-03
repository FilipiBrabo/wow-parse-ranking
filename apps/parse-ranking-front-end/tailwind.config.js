const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        // WCL rank colors
        'rank-gold': '#e5cc80',
        'rank-pink': '#e268a8',
        'rank-orange': '#ff8000',
        'rank-purple': '#a335ee',
        'rank-blue': '#0070ff',
        'rank-green': '#1eff00',
        'rank-gray': '#666666',
      },
    },
  },
  plugins: [],
};
