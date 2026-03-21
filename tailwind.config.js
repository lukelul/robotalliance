/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020814',
          900: '#040d1a',
          800: '#071428',
          700: '#0a1f3d',
          600: '#0e2952',
        },
        accent: '#00d4ff',
      },
    },
  },
  plugins: [],
}

