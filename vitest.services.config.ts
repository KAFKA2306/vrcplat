import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: process.cwd(),
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    }
  }
});
