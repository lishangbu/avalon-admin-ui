import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

interface TestRoute {
  path: string;
  element: ReactElement;
}

interface TestRouterProps {
  initialPath?: string;
  path?: string;
  children: ReactNode;
  routes?: TestRoute[];
}

/** 为页面单元测试创建隔离的 TanStack 内存路由。 */
export function TestRouter({
  initialPath = '/',
  path = '/',
  children,
  routes = [],
}: TestRouterProps) {
  const [router] = useState(() => {
    const rootRoute = createRootRoute();
    const pageRoute = createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => children,
    });
    const extraRoutes = routes.map((route) =>
      createRoute({
        getParentRoute: () => rootRoute,
        path: route.path,
        component: () => route.element,
      }),
    );
    return createRouter({
      routeTree: rootRoute.addChildren([pageRoute, ...extraRoutes]),
      history: createMemoryHistory({ initialEntries: [initialPath] }),
    });
  });
  return <RouterProvider router={router} />;
}
