import { Link, type AnyRoute } from '@tanstack/react-router';
import type { MenuProps } from 'antd';
import type { RouteNavigationMetadata } from '../router';
import { resolveMenuIcon } from './menu-icons';

export interface NavigationNode {
  code: string;
  name: string;
  icon?: string;
  path?: string;
  children: NavigationNode[];
}

/** 展平 TanStack 路由树，供菜单和工作台读取 staticData。 */
export function flattenRoutes(route: AnyRoute): AnyRoute[] {
  return [
    route,
    ...((route.children ?? []) as AnyRoute[]).flatMap((child) => flattenRoutes(child)),
  ];
}

interface MenuBuildOptions {
  groupDirectories?: boolean;
}

/**
 * 从 TanStack 本地路由树生成已按权限裁剪的导航树。
 *
 * 路由 code 同时作为稳定排序键，因此不再需要后端 sortOrder 或任何业务排序字段。
 */
export function buildNavigation(
  routes: readonly AnyRoute[],
  accessNodeCodes: readonly string[],
): NavigationNode[] {
  const granted = new Set(accessNodeCodes);
  const definitions = routes.flatMap((route) => {
    const staticData = route.options.staticData;
    const routeCode = staticData?.routeCode;
    const navigation = staticData?.navigation as RouteNavigationMetadata | undefined;
    if (!routeCode || !navigation) return [];
    if (staticData.accessCode && !granted.has(staticData.accessCode)) return [];
    return [{ routeCode, navigation, path: staticData.accessCode ? route.fullPath : undefined }];
  });
  const definitionsByParent = new Map<string, typeof definitions>();
  definitions.forEach((definition) => {
    const parentCode = definition.navigation.parentCode ?? '';
    definitionsByParent.set(parentCode, [
      ...(definitionsByParent.get(parentCode) ?? []),
      definition,
    ]);
  });

  const buildChildren = (parentCode = ''): NavigationNode[] =>
    (definitionsByParent.get(parentCode) ?? [])
      .map(({ routeCode, navigation, path }) => ({
        code: routeCode,
        name: navigation.label,
        icon: navigation.iconKey,
        path,
        children: buildChildren(routeCode),
      }))
      .filter((node) => Boolean(node.path) || node.children.length > 0)
      .sort((left, right) => left.code.localeCompare(right.code));

  return buildChildren();
}

/** 将本地导航节点转换为 antd Menu items。 */
export function toMenuItems(
  nodes: NavigationNode[],
  options: MenuBuildOptions = {},
): MenuProps['items'] {
  return nodes.map((node) => {
    const path = resolveNodePath(node);
    const children = node.children.length ? toMenuItems(node.children, options) : undefined;
    const isGroup = Boolean(children?.length);
    const icon = resolveMenuIcon(node.icon);

    if (isGroup && options.groupDirectories) {
      return { key: node.code, label: node.name, type: 'group', children };
    }

    return {
      key: isGroup ? node.code : (path ?? node.code),
      ...(icon ? { icon } : {}),
      label: !isGroup && path ? <Link to={path}>{node.name}</Link> : node.name,
      ...(isGroup ? { children } : {}),
    };
  });
}

export function toRootMenuItems(nodes: NavigationNode[]): MenuProps['items'] {
  return nodes.map((node) => {
    const path = node.children.length ? undefined : resolveNodePath(node);
    const icon = resolveMenuIcon(node.icon);
    return {
      key: node.code,
      ...(icon ? { icon } : {}),
      label: path ? <Link to={path}>{node.name}</Link> : node.name,
    };
  });
}

export function findOpenKeys(nodes: NavigationNode[], currentPath: string): string[] {
  for (const node of nodes) {
    if (!node.children.length || !containsPath(node, currentPath)) continue;
    return [node.code, ...findOpenKeys(node.children, currentPath)];
  }
  return [];
}

export function findActiveRootKey(
  nodes: NavigationNode[],
  currentPath: string,
): string | undefined {
  return nodes.find((node) => containsPath(node, currentPath))?.code;
}

export function flattenMenuNodes(nodes: NavigationNode[]): NavigationNode[] {
  return nodes.flatMap((node) => [node, ...flattenMenuNodes(node.children)]);
}

export function isRoutedMenuNode(node: NavigationNode): boolean {
  return Boolean(node.path);
}

export function resolveNodePath(node: NavigationNode): string | undefined {
  return node.path ?? node.children.map(resolveNodePath).find(Boolean);
}

function containsPath(node: NavigationNode, currentPath: string): boolean {
  return (
    node.path === currentPath || node.children.some((child) => containsPath(child, currentPath))
  );
}
