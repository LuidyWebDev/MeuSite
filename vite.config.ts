import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // O Vite irá escutar em todas as interfaces de rede por padrão
    // e usar uma porta específica.
    port: 5174,
    strictPort: true,
  },
})