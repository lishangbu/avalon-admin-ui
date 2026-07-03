import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';
import type { SessionMenuNode } from '../../services/auth';
import { resolveMenuIcon } from './menu-icons';

interface MenuBuildOptions {
  groupDirectories?: boolean;
}

/**
 * 将后端菜单节点转换为 antd Menu items。
 *
 * 菜单路径只信任后端 `path` 字段：路由权限、展示名称和可见性都由 `/api/session` 返回的树决定。
 * 分组节点使用第一个可点击子节点作为默认路径，混合布局点击根节点时也复用同一条规则。
 */
export function toMenuItems(
  nodes: SessionMenuNode[],
  options: MenuBuildOptions = {},
): MenuProps['items'] {
  return nodes.map((node) => {
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
  return nodes.map((node) => {
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
  return node.name ?? node.code;
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
  return nodes.find((node) => containsPath(node, currentPath))?.code;
}

/**
 * 展平成菜单节点，供工作台统计和面包屑查找使用。
 */
export function flattenMenuNodes(nodes: SessionMenuNode[]): SessionMenuNode[] {
  return nodes.flatMap((node) => [node, ...flattenMenuNodes(node.children ?? [])]);
}

/**
 * 判断节点是否是可点击进入页面的菜单项。
 */
export function isRoutedMenuNode(node: SessionMenuNode): boolean {
  return Boolean(node.path) && node.type === 'ROUTE';
}

export function resolveNodePath(node: SessionMenuNode): string | undefined {
  if (node.path) {
    return node.path;
  }
  return node.children?.map(resolveNodePath).find(Boolean);
}

function containsPath(node: SessionMenuNode, currentPath: string): boolean {
  if (node.path === currentPath) {
    return true;
  }
  return node.children?.some((child) => containsPath(child, currentPath)) ?? false;
}
