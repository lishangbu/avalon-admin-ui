import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { lazyPage } from './lazy-page';
import { AppLayout } from './layout/AppLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { gameDataPageRoutes } from '../pages/game-data/game-data-page-routes';
import { battleRulesPageRoutes } from '../pages/battle-rules/battle-rules-page-routes';

const DashboardPage = lazyPage(() => import('../pages/dashboard/DashboardPage'), 'DashboardPage');
const ForbiddenPage = lazyPage(() => import('../pages/error/ForbiddenPage'), 'ForbiddenPage');
const NotFoundPage = lazyPage(() => import('../pages/error/NotFoundPage'), 'NotFoundPage');
const UsersPage = lazyPage(() => import('../pages/system/rbac/users/UsersPage'), 'UsersPage');
const RolesPage = lazyPage(() => import('../pages/system/rbac/roles/RolesPage'), 'RolesPage');
const AccessNodesPage = lazyPage(
  () => import('../pages/system/rbac/access-nodes/AccessNodesPage'),
  'AccessNodesPage',
);
const OAuthClientsPage = lazyPage(
  () => import('../pages/system/oauth/clients/OAuthClientsPage'),
  'OAuthClientsPage',
);
const JwksPage = lazyPage(() => import('../pages/system/oauth/jwks/JwksPage'), 'JwksPage');
const OAuthTokensPage = lazyPage(
  () => import('../pages/system/oauth/tokens/OAuthTokensPage'),
  'OAuthTokensPage',
);
const ScheduledTasksPage = lazyPage(
  () => import('../pages/system/scheduler/tasks/ScheduledTasksPage'),
  'ScheduledTasksPage',
);

/**
 * 应用路由。
 *
 * 页面权限跟后端访问节点 code 保持一致；前端只做显示和导航控制，后端仍强制校验接口访问。
 */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="system">
            <Route index element={<Navigate to="/system/rbac/users" replace />} />
            <Route path="rbac/users" element={<UsersPage />} />
            <Route path="rbac/roles" element={<RolesPage />} />
            <Route path="rbac/access-nodes" element={<AccessNodesPage />} />
            <Route path="oauth/clients" element={<OAuthClientsPage />} />
            <Route path="oauth/tokens" element={<OAuthTokensPage />} />
            <Route path="oauth/jwks" element={<JwksPage />} />
            <Route path="scheduler/tasks" element={<ScheduledTasksPage />} />
          </Route>
          <Route path="game-data">
            <Route index element={<Navigate to="/game-data/creatures" replace />} />
            {gameDataPageRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
          <Route path="battle-rules">
            <Route index element={<Navigate to="/battle-rules/battle-formats" replace />} />
            {battleRulesPageRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
          <Route path="403" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
