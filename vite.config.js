import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Weather-app/',
  define: {
    'process.env': {},
  },
  build: {
    target: 'esnext',
  },
});
