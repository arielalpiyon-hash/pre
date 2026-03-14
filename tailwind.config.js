/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f5f6f3',
          100: '#e8ebe3',
          200: '#d1d7c7',
          300: '#b4bda3',
          400: '#97a381',
          500: '#7d8b66',
          600: '#6B7A3A',
          700: '#556B2F',
          800: '#455626',
          900: '#3a4820',
        },
        khaki: {
          50: '#faf9f7',
          100: '#f2f0eb',
          200: '#e8e4dc',
          300: '#dbd4c8',
          400: '#C3B091',
          500: '#b5a07e',
          600: '#a08d6f',
          700: '#85755d',
          800: '#6e604e',
          900: '#5a4f41',
        },
        neutral: {
          50: '#F5F5F3',
        }
      },
    },
  },
  plugins: [],
};
