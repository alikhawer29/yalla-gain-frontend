import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = mode === 'development' ? env.REACT_APP_BASE_NAME : env.REACT_APP_BASE_NAME;
  return {
    base,
    define: {
      'process.env': env
    },
    plugins: [react(),svgr()],
    build: {
      outDir: 'dist',  // Default output directory
      assetsDir: 'assets',  // Directory for assets (js, css, etc.)
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',  // Customize entry file names
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      }
    }
  }
});
