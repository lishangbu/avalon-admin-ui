import { expect, it } from 'vitest';
import { fallbackMenuNodes, flattenMenuNodes, toMenuItems } from './menu';

it('converts backend menu tree to menu items with paths', () => {
  const items = toMenuItems([
    {
      code: 'system',
      title: '系统管理',
      children: [
        { code: 'system.rbac.users', title: '用户管理', componentKey: 'system/rbac/users' },
      ],
    },
  ]);

  expect(items[0]).toMatchObject({
    key: 'system',
    label: '系统管理',
  });
  expect(items[0]).toHaveProperty('children');
});

it('flattens fallback menu nodes for dashboard shortcuts', () => {
  const nodes = flattenMenuNodes(fallbackMenuNodes);

  expect(nodes.some((node) => node.componentKey === 'system/rbac/users')).toBe(true);
});
