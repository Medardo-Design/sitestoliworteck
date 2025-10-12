/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6e6eb',
          100: '#ccccdb',
          200: '#9999b8',
          300: '#666694',
          400: '#333370',
          500: '#000033',
          600: '#00002e',
          700: '#000029',
          800: '#000024',
          900: '#00001f',
        },
      },
    },
  },
  plugins: [],
};
