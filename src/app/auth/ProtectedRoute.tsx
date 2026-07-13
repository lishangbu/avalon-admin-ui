import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, type PropsWithChildren } from 'react';
import { AccessDenied } from '../../shared/components/AccessDenied';
import { hasAccess } from '../../shared/permissions';
import { useAuth } from './AuthProvider';

/** 统一保护所有登录后路由，并保留原目标地址供登录成功后返回。 */
export function AuthenticatedRoute() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === 'anonymous' && location.pathname !== '/login') {
      void navigate({ to: '/login', search: { redirect: location.href }, replace: true });
    }
  }, [auth.status, location.href, navigate]);

  if (auth.status === 'loading') {
    return <div className="p-6 text-sm text-slate-500">正在恢复登录态...</div>;
  }
  if (auth.status === 'anonymous') {
    return null;
  }
  return <Outlet />;
}

/** 根据路由本地声明的权限 code 控制页面准入。 */
export function RouteAccessGuard({
  accessCode,
  children,
}: PropsWithChildren<{ accessCode: string }>) {
  const { session } = useAuth();
  return hasAccess(session?.accessNodeCodes ?? [], accessCode) ? children : <AccessDenied />;
}
