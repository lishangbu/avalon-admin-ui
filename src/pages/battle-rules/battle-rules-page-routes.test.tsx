import { isValidElement } from 'react';
import { expect, it } from 'vitest';
import { battleRulesPageRoutes } from './battle-rules-page-routes';

it('keeps battle rule page routes unique and renderable', () => {
  const routePaths = battleRulesPageRoutes.map((route) => route.path);

  expect(new Set(routePaths).size).toBe(routePaths.length);
  battleRulesPageRoutes.forEach((route) => {
    expect(isValidElement(route.element)).toBe(true);
  });
});
