import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect, useState, type ReactElement } from 'react';
import { AuthenticatedRoute, RouteAccessGuard } from './auth/ProtectedRoute';
import { lazyPage } from './lazy-page';
import { AppLayout } from './layout/AppLayout';
import { useNavigation } from './layout/useNavigation';
import { LoginPage } from '../pages/auth/LoginPage';
import { battleRulesPageRoutes } from '../pages/battle-rules/battle-rules-page-routes';
import { gameDataPageRoutes } from '../pages/game-data/game-data-page-routes';

const DashboardPage = lazyPage(() => import('../pages/dashboard/DashboardPage'), 'DashboardPage');
const BattleSandboxPage = lazyPage(
  () => import('../pages/battle-sandbox/BattleSandboxPage'),
  'BattleSandboxPage',
);
const BattleSessionsPage = lazyPage(
  () => import('../pages/battle-sessions/list/BattleSessionsPage'),
  'BattleSessionsPage',
);
const BattleSessionCreatePage = lazyPage(
  () => import('../pages/battle-sessions/create/BattleSessionCreatePage'),
  'BattleSessionCreatePage',
);
const BattleSessionDetailPage = lazyPage(
  () => import('../pages/battle-sessions/detail/BattleSessionDetailPage'),
  'BattleSessionDetailPage',
);
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
const PlayHomePage = lazyPage(() => import('../pages/play/PlayHomePage'), 'PlayHomePage');

export interface RouteNavigationMetadata {
  label: string;
  iconKey?: string;
  parentCode?: string;
}

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    routeCode?: string;
    accessCode?: string;
    navigation?: RouteNavigationMetadata;
  }
}

const rootRoute = createRootRoute({ component: Outlet, notFoundComponent: NotFoundPage });
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LoginPage,
});
const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  component: AuthenticatedRoute,
});
const playRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: 'play',
  component: PlayHomePage,
});
const layoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  id: '_layout',
  component: AppLayout,
});

function LandingRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  useEffect(() => {
    if (!navigation.length) {
      void navigate({ to: '/play', replace: true });
    }
  }, [navigate, navigation.length]);
  return navigation.length ? <DashboardPage /> : null;
}

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: LandingRoute,
});
const forbiddenRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '403',
  component: ForbiddenPage,
});

function createNavigationGroup(
  id: string,
  routeCode: string,
  label: string,
  iconKey: string,
  parentCode?: string,
) {
  return createRoute({
    getParentRoute: () => layoutRoute,
    id,
    component: Outlet,
    staticData: {
      routeCode,
      navigation: { label, iconKey, parentCode },
    },
  });
}

function createPageRoute(
  parentRoute: ReturnType<typeof createNavigationGroup>,
  path: string,
  routeCode: string,
  label: string,
  iconKey: string,
  element: ReactElement,
) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path,
    component: () => <RouteAccessGuard accessCode={routeCode}>{element}</RouteAccessGuard>,
    staticData: {
      routeCode,
      accessCode: routeCode,
      navigation: {
        label,
        iconKey,
        parentCode: parentRoute.options.staticData?.routeCode,
      },
    },
  });
}

const systemGroup = createNavigationGroup(
  'system-navigation',
  'system',
  '系统管理',
  'lucide:settings',
);
const gameDataGroup = createNavigationGroup(
  'game-data-navigation',
  'game-data',
  '游戏资料',
  'lucide:database',
);
const battleRulesGroup = createNavigationGroup(
  'battle-rules-navigation',
  'battle-rules',
  '战斗规则',
  'lucide:swords',
);

const systemRoutes = [
  createPageRoute(
    systemGroup,
    'system/rbac/users',
    'system.rbac.users',
    '用户管理',
    'lucide:users',
    <UsersPage />,
  ),
  createPageRoute(
    systemGroup,
    'system/rbac/roles',
    'system.rbac.roles',
    '角色管理',
    'lucide:shield-user',
    <RolesPage />,
  ),
  createPageRoute(
    systemGroup,
    'system/rbac/access-nodes',
    'system.rbac.access-nodes',
    '访问节点',
    'lucide:network',
    <AccessNodesPage />,
  ),
  createPageRoute(
    systemGroup,
    'system/oauth/clients',
    'system.oauth.clients',
    '授权客户端',
    'lucide:plug',
    <OAuthClientsPage />,
  ),
  createPageRoute(
    systemGroup,
    'system/oauth/jwks',
    'system.oauth.jwks',
    '签名密钥管理',
    'lucide:key',
    <JwksPage />,
  ),
  createPageRoute(
    systemGroup,
    'system/oauth/tokens',
    'system.oauth.tokens',
    '令牌管理',
    'lucide:ticket-check',
    <OAuthTokensPage />,
  ),
  createPageRoute(
    systemGroup,
    'system/scheduler/tasks',
    'system.scheduler.tasks',
    '定时任务',
    'lucide:clock',
    <ScheduledTasksPage />,
  ),
];

const gameDataRoutes = gameDataPageRoutes.map((page) =>
  createPageRoute(
    gameDataGroup,
    `game-data/${page.path}`,
    `game-data.${page.path}`,
    page.label,
    page.iconKey,
    page.element,
  ),
);
const battleRulesRoutes = battleRulesPageRoutes.map((page) =>
  createPageRoute(
    battleRulesGroup,
    `battle-rules/${page.path}`,
    `battle-rules.${page.path}`,
    page.label,
    page.iconKey,
    page.element,
  ),
);

const battleSandboxRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'battle-sandbox',
  component: () => (
    <RouteAccessGuard accessCode="battle-sandbox">
      <BattleSandboxPage />
    </RouteAccessGuard>
  ),
  staticData: {
    routeCode: 'battle-sandbox',
    accessCode: 'battle-sandbox',
    navigation: {
      label: '战斗沙盒',
      iconKey: 'lucide:flask-conical',
    },
  },
});
const battleSessionsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'battle-sessions',
  component: () => (
    <RouteAccessGuard accessCode="battle-sessions">
      <BattleSessionsPage />
    </RouteAccessGuard>
  ),
  staticData: {
    routeCode: 'battle-sessions',
    accessCode: 'battle-sessions',
    navigation: {
      label: '战斗会话',
      iconKey: 'lucide:swords',
    },
  },
});
const battleSessionCreateRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'battle-sessions/new',
  component: () => (
    <RouteAccessGuard accessCode="battle-sessions">
      <BattleSessionCreatePage />
    </RouteAccessGuard>
  ),
  staticData: { routeCode: 'battle-sessions.new', accessCode: 'battle-sessions' },
});
const battleSessionDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'battle-sessions/$sessionId',
  component: () => (
    <RouteAccessGuard accessCode="battle-sessions">
      <BattleSessionDetailPage />
    </RouteAccessGuard>
  ),
  staticData: { routeCode: 'battle-sessions.detail', accessCode: 'battle-sessions' },
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedRoute.addChildren([
    playRoute,
    layoutRoute.addChildren([
      dashboardRoute,
      forbiddenRoute,
      systemGroup.addChildren(systemRoutes),
      gameDataGroup.addChildren(gameDataRoutes),
      battleRulesGroup.addChildren(battleRulesRoutes),
      battleSandboxRoute,
      battleSessionsRoute,
      battleSessionCreateRoute,
      battleSessionDetailRoute,
    ]),
  ]),
]);

export function createAppRouter() {
  return createRouter({ routeTree });
}

export const router = createAppRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/** 使用 TanStack Router 渲染本地路由树。 */
export function AppRouter() {
  const [appRouter] = useState(createAppRouter);
  return <RouterProvider router={appRouter} />;
}
