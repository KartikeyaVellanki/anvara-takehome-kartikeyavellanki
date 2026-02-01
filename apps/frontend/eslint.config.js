import { reactConfig } from '@anvara/eslint-config';

export default [
  ...reactConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        React: 'readonly',
        RequestInit: 'readonly',
        HeadersInit: 'readonly',
      },
    },
    rules: {
      // Frontend-specific rules
    },
  },
];
