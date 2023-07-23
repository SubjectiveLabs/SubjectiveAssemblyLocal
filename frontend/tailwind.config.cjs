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
        cinder: {
          50 : '#f5f6fa',
          100: '#eaecf4',
          200: '#d1d6e6',
          300: '#a9b3d0',
          400: '#7b8bb5',
          500: '#5a6c9d',
          600: '#465483',
          700: '#3a456a',
          800: '#333c59',
          900: '#2e344c',
          950: '#11131c'
        },
        gold: {
          50 : '#ffffe7',
          100: '#ffffc1',
          200: '#fffb86',
          300: '#fff141',
          400: '#ffe10d',
          500: '#ffd200',
          600: '#d19a00',
          700: '#a66e02',
          800: '#89550a',
          900: '#74460f',
          950: '#442404'
        }

      }
    }
  }
}
