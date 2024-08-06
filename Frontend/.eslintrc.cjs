/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  plugins: [
    '@stylistic/js'
  ],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'comma-dangle': ['error', 'only-multiline'],
    semi: ['error', 'always'],
    '@stylistic/js/quotes': ['error', 'single'],
    '@stylistic/js/object-curly-spacing': ['error', 'always'],
    '@stylistic/js/template-curly-spacing': ['error', 'never'],
    'prefer-template': 'error',
  },
};
