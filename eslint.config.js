import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// ESLint flat config 与 TypeScript strict 配置配套使用，优先发现未使用代码和错误依赖。
export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'src/services/generated/openapi.json',
      'src/services/generated/schema.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
);
