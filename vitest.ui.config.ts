import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    dir: '.',
    environment: 'jsdom',
    include: ['apps/dashboard/tests/**/*.test.{ts,tsx}'],
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
