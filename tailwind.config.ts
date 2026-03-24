import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          500: '#0070f3',
          600: '#0059c7'
        }
      }
    }
  },
  plugins: []
};

export default config;
