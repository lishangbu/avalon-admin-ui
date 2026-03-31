import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), vueJsx(), tailwindcss()],
    // `declare enum YesNo` in common.d.ts is type-only and generates no JS.
    // Vite's define inlines the literal values so runtime references don't throw.
    define: {
      'YesNo.Yes': '1',
      'YesNo.No': '0',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
        },
      },
    },
    build: {
      rolldownOptions: {
        output: {
          assetFileNames: (asset) => {
            const notHash = ['topography.svg', 'texture.png', 'noise.png']
            if (asset.names?.some((name) => notHash.includes(name))) {
              return 'assets/[name][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },

          minify: {
            compress: {
              dropConsole: true,
              dropDebugger: true,
            },
          },
        },
      },
    },
  }
})
