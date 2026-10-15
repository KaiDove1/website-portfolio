import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves the site from /website-portfolio/, so every asset URL needs that prefix.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/website-portfolio/',
});
