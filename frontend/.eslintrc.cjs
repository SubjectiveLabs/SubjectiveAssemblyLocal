/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    es2020 : true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser       : '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType : 'module'
  },
  ignorePatterns: [ 'node_modules/', 'dist/' ],
  plugins       : [ 'react-refresh', '@typescript-eslint' ],
  root: true
}
