import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// 测试环境入口只放全局测试扩展，避免单个测试文件重复引入 matcher。
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// antd 的 Table、Select、Modal 等组件会通过 ResizeObserver 监听布局尺寸。
// jsdom 不实现该浏览器 API，这里提供一个最小可用 polyfill，保证组件能挂载并完成交互测试。
class ResizeObserverMock {
  observe() {
    return undefined;
  }

  unobserve() {
    return undefined;
  }

  disconnect() {
    return undefined;
  }
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});
