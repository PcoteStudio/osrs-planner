/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  plugins: [
    '@stylistic/js',
    'no-only-tests'
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
    'no-unused-vars': ["warn", { "argsIgnorePattern": "^_" }],
    '@typescript-eslint/no-unused-vars': ["warn", { "argsIgnorePattern": "^_" }],
    'class-methods-use-this': 'error',
    'comma-dangle': ['error', 'only-multiline'],
    'eqeqeq': ['error', 'always'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    semi: ['error', 'always'],
    '@stylistic/js/quotes': ['error', 'single'],
    '@stylistic/js/object-curly-spacing': ['error', 'always'],
    '@stylistic/js/template-curly-spacing': ['error', 'never'],
    'no-only-tests/no-only-tests': 'error',
    'prefer-template': 'error',
  },
};
