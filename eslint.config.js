import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,

  // Исходный код
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      // Разрешаем параметры вида «_» (placeholder для неиспользуемого аргумента)
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Тесты
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.jest,
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
    },
  },
]
