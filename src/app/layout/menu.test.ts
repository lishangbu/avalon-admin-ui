import { expect, it } from 'vitest';
import {
  findActiveRootKey,
  findOpenKeys,
  flattenMenuNodes,
  isRoutedMenuNode,
  resolveNodeLabel,
  toMenuItems,
  toRootMenuItems,
} from './menu';

type MenuLeafForTest = {
  key: string;
  label: { props?: { children?: unknown; to?: unknown } };
};

it('converts backend menu tree to menu items with paths', () => {
  const items = toMenuItems([
    {
      code: 'system',
      name: '系统管理',
      icon: 'lucide:settings',
      children: [{ code: 'system.rbac.users', name: '用户管理', path: '/system/rbac/users' }],
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

it('supports battle sandbox lucide menu icon', () => {
  const items = toMenuItems([
    {
      code: 'battle-sandbox',
      name: '战斗沙盒',
      icon: 'lucide:flask-conical',
      path: '/battle-sandbox',
    },
  ]);

  expect(items[0]).toHaveProperty('icon');
});

it('falls back to node code when name is missing', () => {
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

it('uses backend path instead of local component key mapping', () => {
  const items = toMenuItems([
    {
      code: 'battle-rules',
      name: '战斗规则',
      children: [
        {
          code: 'battle-rules.effects',
          name: '规则效果',
          children: [
            {
              code: 'battle-rules.skill-rules',
              name: '技能规则',
              path: '/battle-rules/skill-rules',
            },
          ],
        },
      ],
    },
  ]);

  const rootItem = items[0] as {
    children?: Array<{ children?: Array<{ key: string; label: { props?: { to?: unknown } } }> }>;
  };
  const skillRuleItem = rootItem.children?.[0]?.children?.[0];

  expect(skillRuleItem).toMatchObject({
    key: '/battle-rules/skill-rules',
  });
  expect(skillRuleItem?.label.props).toMatchObject({
    to: '/battle-rules/skill-rules',
  });
});

it('does not turn component keys into links when backend path is missing', () => {
  const items = toMenuItems([
    {
      code: 'battle-rules',
      name: '战斗规则',
      children: [
        {
          code: 'battle-rules.effects',
          name: '规则效果',
          children: [
            {
              code: 'battle-rules.skill-rules',
              name: '技能规则',
            },
          ],
        },
      ],
    },
  ]);

  const rootItem = items[0] as {
    children?: Array<{ children?: MenuLeafForTest[] }>;
  };
  const skillRuleItem = rootItem.children?.[0]?.children?.[0];

  expect(skillRuleItem).toMatchObject({
    key: 'battle-rules.skill-rules',
    label: '技能规则',
  });
});

it('finds active and open state for backend battle rule menus', () => {
  const nodes = [
    {
      code: 'battle-rules',
      name: '战斗规则',
      children: [
        {
          code: 'battle-rules.runtime',
          name: '运行时工具',
          children: [
            {
              code: 'battle-rules.action-validation',
              name: '行动校验',
              path: '/battle-rules/action-validation',
            },
          ],
        },
      ],
    },
  ];

  const rootItems = toRootMenuItems(nodes);

  expect(rootItems[0]).toMatchObject({
    key: 'battle-rules',
    label: '战斗规则',
  });
  expect(findActiveRootKey(nodes, '/battle-rules/action-validation')).toBe('battle-rules');
  expect(findOpenKeys(nodes, '/battle-rules/action-validation')).toEqual([
    'battle-rules',
    'battle-rules.runtime',
  ]);
});

it('flattens server menu nodes for dashboard statistics', () => {
  const nodes = flattenMenuNodes([
    {
      code: 'system',
      name: '系统管理',
      type: 'DIRECTORY',
      children: [
        {
          code: 'system.rbac.users',
          name: '用户管理',
          type: 'ROUTE',
          path: '/system/rbac/users',
        },
      ],
    },
  ]);

  expect(nodes.map((node) => node.code)).toEqual(['system', 'system.rbac.users']);
});

it('identifies routed menu nodes without component keys', () => {
  const nodes = flattenMenuNodes([
    {
      code: 'system',
      name: '系统管理',
      type: 'DIRECTORY',
      path: '/system',
      children: [
        {
          code: 'system.rbac.users',
          name: '用户管理',
          type: 'ROUTE',
          path: '/system/rbac/users',
        },
        {
          code: 'battle-rules.skill-rules',
          name: '技能规则',
          type: 'ROUTE',
          path: '/battle-rules/skill-rules',
        },
        {
          code: 'system.rbac.audit',
          name: '审计占位',
          path: '/system/rbac/audit',
        },
      ],
    },
  ]);

  expect(nodes.filter(isRoutedMenuNode).map((node) => node.code)).toEqual([
    'system.rbac.users',
    'battle-rules.skill-rules',
  ]);
});
