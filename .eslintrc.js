module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:node/recommended'
  ],
  env: {
    node: true,
    es6: true,
    commonjs: true,
    'jest/globals': true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: ['jest', 'node'],
}
