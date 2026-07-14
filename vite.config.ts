import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Vite 配置集中声明本地联调端口、后端代理和测试环境，避免在页面层散落环境假设。
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store',
    },
    proxy: {
      '/api/player/events': { target: 'http://localhost:8080', ws: true },
      '/api': 'http://localhost:8080',
      '/v3': 'http://localhost:8080',
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // CI 与本地受限环境中，大量 jsdom 页面测试并发会争抢 CPU，导致异步渲染超过默认等待窗口。
    // 固定双 worker 在保留文件级并发的同时，为 Ant Design 组件渲染留出稳定的调度余量。
    maxWorkers: 2,
    server: {
      deps: {
        inline: ['@ant-design/pro-components'],
      },
    },
  },
});
