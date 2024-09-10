import ts from "typescript-eslint";
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import stylisticJs from '@stylistic/eslint-plugin-js';
import noOnlyTests from 'eslint-plugin-no-only-tests';

const strictConfigs = ts.configs.strict;
strictConfigs.forEach((config) => {
  config.files = ["**/*.ts"];
});

export default [
  ...pluginVue.configs['flat/essential'],
  ...strictConfigs,
  {
    files: ["**/*.vue", "**/*.ts"],
    languageOptions: { 
    parser: vueParser, 
    parserOptions: {
      sourceType: 'module',
      parser: {
        ts: ts.parser,
        },
      },
    },
    plugins: {
      stylisticJs,
      noOnlyTests,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'class-methods-use-this': 'error',
      'comma-dangle': ['error', 'only-multiline'],
      'eqeqeq': ['error', 'always'],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      semi: ['error', 'always'],
      'stylisticJs/quotes': ['error', 'single'],
      'stylisticJs/object-curly-spacing': ['error', 'always'],
      'stylisticJs/template-curly-spacing': ['error', 'never'],
      'noOnlyTests/no-only-tests': 'error',
      'prefer-template': 'error',
    },
  },
  {
    files: ["**/*.spec.ts"],
    rules: {
      '@typescript-eslint/no-non-null-assertion': "off"
    }
  },
  {
    files: ["**/components.d.ts"],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    }
  }
];
