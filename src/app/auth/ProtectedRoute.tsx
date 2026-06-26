import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { hasAccess } from '../../shared/permissions';
import { AccessDenied } from '../../shared/components/AccessDenied';
import { useAuth } from './AuthProvider';

export interface ProtectedRouteProps {
  requiredAccess?: string;
}

/**
 * 路由守卫。
 *
 * 未登录用户进入登录页；已登录但缺少访问节点时显示 403，而不是静默跳走，
 * 这样管理员能清楚知道是权限问题还是页面不存在。
 */
export function ProtectedRoute({ requiredAccess }: ProtectedRouteProps) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === 'loading') {
    return <div className="p-6 text-sm text-slate-500">正在恢复登录态...</div>;
  }

  if (auth.status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasAccess(auth.session?.accessNodeCodes ?? [], requiredAccess)) {
    return <AccessDenied />;
  }

  return <Outlet />;
}
