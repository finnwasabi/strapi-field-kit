import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    // @strapi/ui-primitives has no "exports" and its "main" is CJS under
    // "type": "module", which Node refuses to load. Prefer the ESM "module" build.
    mainFields: ['module', 'main'],
  },
  test: {
    include: ['packages/*/{admin,server}/src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    server: {
      deps: {
        // Let Vite resolve these (honouring mainFields) instead of Node.
        inline: [/@strapi\/(design-system|ui-primitives)/],
      },
    },
  },
});
