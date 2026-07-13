import { expect, it } from 'vitest';
import { battleRulesPageRoutes } from '../../pages/battle-rules/battle-rules-page-routes';
import { gameDataPageRoutes } from '../../pages/game-data/game-data-page-routes';
import { router } from '../router';
import {
  buildNavigation,
  findActiveRootKey,
  findOpenKeys,
  flattenMenuNodes,
  flattenRoutes,
  resolveNodePath,
} from './menu';

const routes = flattenRoutes(router.routeTree);
const allAccessCodes = routes.flatMap((route) => {
  const accessCode = route.options.staticData?.accessCode;
  return accessCode ? [accessCode] : [];
});

it('从完整本地路由树生成与可访问页面精确一致的菜单集合', () => {
  const nodes = buildNavigation(routes, allAccessCodes);
  const actualPaths = flattenMenuNodes(nodes)
    .flatMap((node) => (node.path ? [node.path] : []))
    .sort();
  const expectedPaths = [
    '/system/rbac/users',
    '/system/rbac/roles',
    '/system/rbac/access-nodes',
    '/system/oauth/clients',
    '/system/oauth/jwks',
    '/system/oauth/tokens',
    '/system/scheduler/tasks',
    ...gameDataPageRoutes.map((route) => `/game-data/${route.path}`),
    ...battleRulesPageRoutes.map((route) => `/battle-rules/${route.path}`),
    '/battle-sandbox',
    '/battle-sessions',
  ].sort();

  expect(actualPaths).toEqual(expectedPaths);
  expect(new Set(actualPaths).size).toBe(actualPaths.length);
});

it('按权限 code 裁剪菜单并按 routeCode 稳定排序', () => {
  const nodes = buildNavigation(routes, ['system.rbac.users', 'system.rbac.roles']);

  expect(nodes.map((node) => node.code)).toEqual(['system']);
  expect(nodes[0]?.children.map((node) => node.code)).toEqual([
    'system.rbac.roles',
    'system.rbac.users',
  ]);
});

it('从本地菜单树解析当前路径、展开节点和根节点', () => {
  const nodes = buildNavigation(routes, ['system.rbac.users']);

  expect(resolveNodePath(nodes[0]!)).toBe('/system/rbac/users');
  expect(findOpenKeys(nodes, '/system/rbac/users')).toEqual(['system']);
  expect(findActiveRootKey(nodes, '/system/rbac/users')).toBe('system');
});
