import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"', // חשוב למנוע טעינת רכיבים מיותרים ב־firebase
  },
  build: {
    rollupOptions: {
      // מונע טעינה של gapi/platform.js כשנבנה לקומפילציה של אפליקציה נייטיבית
      external: [
        'gapi',
        'gapi.auth2',
        'gapi.client',
        'platform.js'
      ]
    }
  }
});
