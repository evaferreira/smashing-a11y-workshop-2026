import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules', 'storybook-static'] },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  reactHooks.configs.flat['recommended-latest'],
  storybook.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: { console: 'readonly', process: 'readonly', window: 'readonly' },
    },
  },
  prettier,
);
