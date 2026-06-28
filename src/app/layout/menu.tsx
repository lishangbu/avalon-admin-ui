import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';
import type { SessionMenuNode } from '../../services/auth';
import { gameDataRouteMetas } from '../../pages/game-data/game-data-resources';
import { battleRulesRouteMetas } from '../../pages/battle-rules/battle-rules-resources';
import { resolveMenuIcon } from './menu-icons';

interface MenuBuildOptions {
  groupDirectories?: boolean;
}

export interface RouteMeta {
  path: string;
  title: string;
  componentKey: string;
  accessCode?: string;
}

export const routeMetas: RouteMeta[] = [
  { path: '/', title: '工作台', componentKey: 'dashboard' },
  {
    path: '/system/rbac/users',
    title: '用户管理',
    componentKey: 'system/rbac/users',
    accessCode: 'system.rbac.users',
  },
  {
    path: '/system/rbac/roles',
    title: '角色管理',
    componentKey: 'system/rbac/roles',
    accessCode: 'system.rbac.roles',
  },
  {
    path: '/system/rbac/access-nodes',
    title: '访问节点',
    componentKey: 'system/rbac/access-nodes',
    accessCode: 'system.rbac.access-nodes',
  },
  {
    path: '/system/oauth/clients',
    title: 'OAuth 客户端',
    componentKey: 'system/oauth/clients',
    accessCode: 'system.oauth.clients',
  },
  {
    path: '/system/oauth/tokens',
    title: '令牌管理',
    componentKey: 'system/oauth/tokens',
    accessCode: 'system.oauth.tokens',
  },
  {
    path: '/system/oauth/jwks',
    title: 'JWK 管理',
    componentKey: 'system/oauth/jwks',
    accessCode: 'system.oauth.jwks',
  },
  {
    path: '/system/scheduler/tasks',
    title: '定时任务',
    componentKey: 'system/scheduler/tasks',
    accessCode: 'system.scheduler.tasks',
  },
  ...battleRulesRouteMetas,
  ...gameDataRouteMetas,
];

export const componentPathMap = new Map(routeMetas.map((meta) => [meta.componentKey, meta.path]));

/**
 * 将后端菜单节点转换为 antd Menu items。
 *
 * 后端可能只返回分组节点，也可能返回可点击叶子节点。分组节点使用第一个可点击子节点作为 key，
 * 这样测试和选中态都能稳定定位到实际页面路径。
 */
export function toMenuItems(
  nodes: SessionMenuNode[],
  options: MenuBuildOptions = {},
): MenuProps['items'] {
  return nodes.filter(isUsableMenuNode).map((node) => {
    const path = resolveNodePath(node);
    const children = node.children?.length ? toMenuItems(node.children, options) : undefined;
    const isGroup = Boolean(children?.length);
    const label = resolveNodeLabel(node);
    const icon = resolveMenuIcon(node.icon);

    if (isGroup && options.groupDirectories) {
      return {
        key: node.code,
        label,
        type: 'group',
        children,
      };
    }

    return {
      key: isGroup ? node.code : (path ?? node.code),
      ...(icon ? { icon } : {}),
      label: !isGroup && path ? <Link to={path}>{label}</Link> : label,
      ...(isGroup ? { children } : {}),
    };
  });
}

export function toRootMenuItems(nodes: SessionMenuNode[]): MenuProps['items'] {
  return nodes.filter(isUsableMenuNode).map((node) => {
    const label = resolveNodeLabel(node);
    const path = node.children?.length ? undefined : resolveNodePath(node);
    const icon = resolveMenuIcon(node.icon);

    return {
      key: node.code,
      ...(icon ? { icon } : {}),
      label: path ? <Link to={path}>{label}</Link> : label,
    };
  });
}

export function resolveNodeLabel(node: SessionMenuNode): string {
  return node.title ?? node.name ?? node.code;
}

export function findOpenKeys(nodes: SessionMenuNode[], currentPath: string): string[] {
  for (const node of nodes) {
    if (!node.children?.length || !containsPath(node, currentPath)) {
      continue;
    }

    return [node.code, ...findOpenKeys(node.children, currentPath)];
  }

  return [];
}

export function findActiveRootKey(
  nodes: SessionMenuNode[],
  currentPath: string,
): string | undefined {
  return nodes.find((node) => isUsableMenuNode(node) && containsPath(node, currentPath))?.code;
}

/**
 * 展平成菜单节点，供工作台统计和面包屑查找使用。
 */
export function flattenMenuNodes(nodes: SessionMenuNode[]): SessionMenuNode[] {
  return nodes.flatMap((node) => [node, ...flattenMenuNodes(node.children ?? [])]);
}

export function resolveNodePath(node: SessionMenuNode): string | undefined {
  if (node.path) {
    return node.path;
  }
  if (node.componentKey && componentPathMap.has(node.componentKey)) {
    return componentPathMap.get(node.componentKey);
  }
  return node.children?.map(resolveNodePath).find(Boolean);
}

function containsPath(node: SessionMenuNode, currentPath: string): boolean {
  if (node.path === currentPath) {
    return true;
  }
  if (node.componentKey && componentPathMap.get(node.componentKey) === currentPath) {
    return true;
  }
  return node.children?.some((child) => containsPath(child, currentPath)) ?? false;
}

function isUsableMenuNode(node: SessionMenuNode): boolean {
  return node.visible !== false && node.enabled !== false;
}
