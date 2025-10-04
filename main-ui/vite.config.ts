import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import aliasPaths from './tsconfig.paths.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...Object.fromEntries(
        Object.entries(aliasPaths.compilerOptions.paths).map(([key, value]) => [
          key.replace('/*', ''),
          path.resolve(__dirname, value[0].replace('/*', '').replace('*', '')),
        ])
      ),
    },
  },
})
