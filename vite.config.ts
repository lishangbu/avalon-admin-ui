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
    // WSL 下大量 jsdom 页面测试同时启动 worker 时容易触发 Vitest worker 响应超时。
    // 固定中等并发可以限制 worker 风暴，同时避免单 worker/双 worker 让全量测试慢到不可用。
    maxWorkers: 4,
    server: {
      deps: {
        inline: ['@ant-design/pro-components'],
      },
    },
  },
});
