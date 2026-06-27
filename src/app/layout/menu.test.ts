import { expect, it } from 'vitest';
import {
  findActiveRootKey,
  findOpenKeys,
  flattenMenuNodes,
  resolveNodeLabel,
  toMenuItems,
  toRootMenuItems,
} from './menu';

it('converts backend menu tree to menu items with paths', () => {
  const items = toMenuItems([
    {
      code: 'system',
      title: '系统管理',
      icon: 'lucide:settings',
      children: [
        { code: 'system.rbac.users', title: '用户管理', componentKey: 'system/rbac/users' },
      ],
    },
  ]);

  expect(items[0]).toMatchObject({
    key: 'system',
    label: '系统管理',
  });
  expect(items[0]).toHaveProperty('icon');
  expect(items[0]).toHaveProperty('children');
});

it('uses backend session node name as menu label', () => {
  const items = toMenuItems([
    {
      code: 'system',
      name: '系统管理',
      children: [
        {
          code: 'system.rbac.users',
          name: '用户管理',
          path: '/system/rbac/users',
          children: [],
        },
      ],
    },
  ]);

  const systemItem = items[0] as {
    key: string;
    label: unknown;
    children?: Array<{ key: string; label: { props?: { children?: unknown; to?: unknown } } }>;
  };
  expect(systemItem).toMatchObject({
    key: 'system',
    label: '系统管理',
  });

  const userItem = systemItem?.children?.[0];
  expect(userItem).toMatchObject({
    key: '/system/rbac/users',
  });
  expect(userItem?.label.props).toMatchObject({
    children: '用户管理',
    to: '/system/rbac/users',
  });
  expect(userItem).not.toHaveProperty('children');
});

it('can render directory nodes as menu groups', () => {
  const items = toMenuItems(
    [
      {
        code: 'system.rbac',
        name: '访问控制',
        children: [
          {
            code: 'system.rbac.users',
            name: '用户管理',
            path: '/system/rbac/users',
          },
        ],
      },
    ],
    { groupDirectories: true },
  );

  expect(items[0]).toMatchObject({
    key: 'system.rbac',
    label: '访问控制',
    type: 'group',
  });
});

it('builds root menu items and finds active root for split mix layout', () => {
  const nodes = [
    {
      code: 'system',
      name: '系统管理',
      children: [
        {
          code: 'system.rbac.users',
          name: '用户管理',
          path: '/system/rbac/users',
        },
      ],
    },
  ];

  const rootItems = toRootMenuItems(nodes);

  expect(rootItems[0]).toMatchObject({
    key: 'system',
    label: '系统管理',
  });
  expect(findActiveRootKey(nodes, '/system/rbac/users')).toBe('system');
});

it('ignores unknown menu icon keys', () => {
  const items = toMenuItems([
    {
      code: 'system',
      name: '系统管理',
      icon: 'SettingOutlined',
      path: '/system',
    },
  ]);

  expect(items[0]).not.toHaveProperty('icon');
});

it('falls back to node code when title and name are missing', () => {
  expect(resolveNodeLabel({ code: 'system.rbac.users' })).toBe('system.rbac.users');
});

it('finds ancestor open keys for backend nested route menus', () => {
  const openKeys = findOpenKeys(
    [
      {
        code: 'system',
        name: '系统管理',
        path: '/system',
        children: [
          {
            code: 'system.rbac',
            name: '访问控制',
            path: '/system/rbac',
            children: [
              {
                code: 'system.rbac.users',
                name: '用户管理',
                path: '/system/rbac/users',
                children: [],
              },
            ],
          },
        ],
      },
    ],
    '/system/rbac/users',
  );

  expect(openKeys).toEqual(['system', 'system.rbac']);
});

it('maps backend game data component keys to routes', () => {
  const items = toMenuItems([
    {
      code: 'game-data',
      name: '游戏资料',
      children: [
        {
          code: 'game-data.core',
          name: '核心资料',
          children: [
            {
              code: 'game-data.creatures',
              name: '生物资料',
              componentKey: 'game-data/creatures',
            },
          ],
        },
      ],
    },
  ]);

  const rootItem = items[0] as {
    children?: Array<{ children?: Array<{ key: string; label: { props?: { to?: unknown } } }> }>;
  };
  const creatureItem = rootItem.children?.[0]?.children?.[0];

  expect(creatureItem).toMatchObject({
    key: '/game-data/creatures',
  });
  expect(creatureItem?.label.props).toMatchObject({
    to: '/game-data/creatures',
  });
});

it('flattens server menu nodes for dashboard statistics', () => {
  const nodes = flattenMenuNodes([
    {
      code: 'system',
      name: '系统管理',
      children: [
        {
          code: 'system.rbac.users',
          name: '用户管理',
          componentKey: 'system/rbac/users',
        },
      ],
    },
  ]);

  expect(nodes.some((node) => node.componentKey === 'system/rbac/users')).toBe(true);
});
