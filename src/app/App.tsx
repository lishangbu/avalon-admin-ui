import { AppProviders } from './providers';
import { AppRouter } from './router';

/**
 * 应用根组件。
 *
 * 根组件只组合全局 Provider 和路由树，业务页面都挂在 router 下，避免应用入口承担业务职责。
 */
export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
