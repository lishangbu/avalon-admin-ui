import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { buildNavigation, flattenRoutes } from './menu';

/** 从当前 TanStack 路由树和登录态权限构造本地导航。 */
export function useNavigation() {
  const router = useRouter();
  const { session } = useAuth();
  return useMemo(
    () => buildNavigation(flattenRoutes(router.routeTree), session?.accessNodeCodes ?? []),
    [router.routeTree, session?.accessNodeCodes],
  );
}
