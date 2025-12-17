import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Serve static files from data folder
  publicDir: 'public',
  // Copy data folder to public during build
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    exclude: ['questions', 'firestore', 'AISarthi', 'LanguageSelector', 'useLanguage', 'videos', 'firebase', 'FlashcardDeck', 'spacedRepetition'],
  },
});
