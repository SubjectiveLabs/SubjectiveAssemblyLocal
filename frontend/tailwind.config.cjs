/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.tsx'
  ],
  plugins: [],
  theme  : {
    extend: {
      fontFamily: {
        mono: "'Fira Code Retina'",
        sans: "'Red Hat Display Bold'"
      }
    }
  }
}
