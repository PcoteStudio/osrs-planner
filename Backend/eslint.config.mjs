import rootConfig from '../eslint.config.mjs';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  ...rootConfig,
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto', semi: true }],
      'class-methods-use-this': 'off',
    },
  },
];
