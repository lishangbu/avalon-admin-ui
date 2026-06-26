import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';
import type { SessionMenuNode } from '../../services/auth';

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
    title: 'OAuth Client',
    componentKey: 'system/oauth/clients',
    accessCode: 'system.oauth.clients',
  },
  {
    path: '/system/oauth/jwks',
    title: 'JWK',
    componentKey: 'system/oauth/jwks',
    accessCode: 'system.oauth.jwks',
  },
  {
    path: '/system/scheduler/tasks',
    title: '定时任务',
    componentKey: 'system/scheduler/tasks',
    accessCode: 'system.scheduler.tasks',
  },
];

export const componentPathMap = new Map(routeMetas.map((meta) => [meta.componentKey, meta.path]));

export const fallbackMenuNodes: SessionMenuNode[] = [
  { code: 'dashboard', title: '工作台', path: '/', componentKey: 'dashboard' },
  {
    code: 'system',
    title: '系统管理',
    children: [
      {
        code: 'system.rbac',
        title: 'RBAC',
        children: [
          { code: 'system.rbac.users', title: '用户管理', componentKey: 'system/rbac/users' },
          { code: 'system.rbac.roles', title: '角色管理', componentKey: 'system/rbac/roles' },
          {
            code: 'system.rbac.access-nodes',
            title: '访问节点',
            componentKey: 'system/rbac/access-nodes',
          },
        ],
      },
      {
        code: 'system.oauth',
        title: 'OAuth',
        children: [
          {
            code: 'system.oauth.clients',
            title: 'OAuth Client',
            componentKey: 'system/oauth/clients',
          },
          { code: 'system.oauth.jwks', title: 'JWK', componentKey: 'system/oauth/jwks' },
        ],
      },
      {
        code: 'system.scheduler',
        title: '任务调度',
        children: [
          {
            code: 'system.scheduler.tasks',
            title: '定时任务',
            componentKey: 'system/scheduler/tasks',
          },
        ],
      },
    ],
  },
];

/**
 * 将后端菜单节点转换为 antd Menu items。
 *
 * 后端可能只返回分组节点，也可能返回可点击叶子节点。分组节点使用第一个可点击子节点作为 key，
 * 这样测试和选中态都能稳定定位到实际页面路径。
 */
export function toMenuItems(nodes: SessionMenuNode[]): MenuProps['items'] {
  return nodes
    .filter((node) => node.visible !== false && node.enabled !== false)
    .map((node) => {
      const path = resolveNodePath(node);
      const children = node.children ? toMenuItems(node.children) : undefined;
      const isGroup = Boolean(children?.length);
      return {
        key: isGroup ? node.code : (path ?? node.code),
        label: !isGroup && path ? <Link to={path}>{node.title}</Link> : node.title,
        children,
      };
    });
}

/**
 * 展平成叶子菜单，供工作台快捷入口和面包屑查找使用。
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
