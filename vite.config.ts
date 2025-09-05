import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts-next'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Components({
      dirs: ['src/components'],
      collapseSamePrefixes: true,
      directoryAsNamespace: true, // 包含文件夹名称，避免命名冲突
      dts: 'src/types/components.d.ts', // 类型提示文件,
      resolvers: [NaiveUiResolver()],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
      ],
      imports: [
        'vue', // 自动加载 vue api
        VueRouterAutoImports, // 自动加载 vue-router api
      ],
      dirs: [
        'src/composables/**/*.ts',
        'src/store/**/*.ts',
        'src/api/**/*.ts',
        'src/utils/http/index.ts',
        'src/types/modules/**/*.ts',
      ], // 自动加载配置里的文件
      defaultExportByFilename: true, // 包含文件夹名称，避免命名冲突
      dts: 'src/types/auto-imports.d.ts', // 类型提示文件,
      resolvers: [NaiveUiResolver()],
    }),
    Layouts(),
    VueRouter({
      routesFolder: 'src/pages',
      // where to generate the types
      dts: 'src/types/typed-router.d.ts',
    }),
    vue(),
    vueJsx(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  esbuild: process.env.NODE_ENV === 'production' ? {
    drop: ["console", "debugger"],
  } : {},
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
