import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    modulePreload: false,
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        articles: resolve(__dirname, 'src/articles/index.html'),
      },
    },
  },
});
