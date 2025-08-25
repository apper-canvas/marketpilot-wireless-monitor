/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F4F2FF',
          100: '#EBE7FF',
          200: '#D8D2FF',
          300: '#BDB1FF',
          400: '#9B86FF',
          500: '#5B4FE8',
          600: '#4B3FE8',
          700: '#3D32E8',
          800: '#3429D4',
          900: '#2B22A8',
        },
        secondary: {
          50: '#F5F4FF',
          100: '#EDEBFF',
          200: '#DDD8FF',
          300: '#C7BDFF',
          400: '#AB98FF',
          500: '#8B80F0',
          600: '#7B6FE8',
          700: '#6B5EE0',
          800: '#5A4DD4',
          900: '#4A3FC8',
        },
        accent: {
          50: '#ECFFF8',
          100: '#D1FFF0',
          200: '#A6FFE1',
          300: '#70FFD0',
          400: '#33FFBB',
          500: '#00D4AA',
          600: '#00B89A',
          700: '#009B8A',
          800: '#007A6B',
          900: '#006557',
        },
        success: '#00C896',
        warning: '#FFB020',
        error: '#FF4757',
        info: '#4A90E2',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}