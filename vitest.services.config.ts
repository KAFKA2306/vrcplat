import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    dir: '.',
    include: ['services/**/tests/**/*.test.ts'],
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
