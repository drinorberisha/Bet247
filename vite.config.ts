import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // This ensures assets are loaded correctly
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
})