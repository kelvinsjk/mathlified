import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { mathlified } from './src/package-lib/index.js';

export default defineConfig({
  plugins: [mathlified(), sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
