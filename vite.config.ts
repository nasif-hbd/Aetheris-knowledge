import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // 'base: ./' ensures asset paths are relative, which is required for GitHub Pages
    base: './',
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
      },
    },
    define: {
      // Polyfill process.env.API_KEY for the Gemini SDK requirements
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY),
      // Polyfill process.env to prevent "process is not defined" crashes
      'process.env': {}
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'dist',
    }
  };
});