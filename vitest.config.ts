/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/'],
    },
  },
});
