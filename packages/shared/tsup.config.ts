import { defineConfig } from 'tsup';

// Builds both ESM (for Vite/React) and CommonJS (for NestJS) from the same source.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2023',
});
