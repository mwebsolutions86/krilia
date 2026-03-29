import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Ajout CRITIQUE pour Tailwind v4
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Activation du moteur CSS
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});