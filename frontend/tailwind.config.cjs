/* eslint-disable sort-keys */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.tsx'
  ],
  plugins: [],
  theme  : {
    extend: {
      divideWidth: { 3: '3px' },
      fontFamily : {
        sans: [
          'Satoshi\\ Variable'
        ]
      },
      colors: {
        gold: {
          50 : '#ffe8bd',
          100: '#ffdeb0',
          200: '#ffd187',
          300: '#ffbf58',
          400: '#ffbc51',
          500: '#ffb83f',
          600: '#dc9a22',
          700: '#b4770e',
          800: '#8a5a09',
          900: '#69470e',
          950: '#563805'
        }

      }
    }
  }
}
