import { isValidElement } from 'react';
import { expect, it } from 'vitest';
import { battleRulesPageRoutes } from './battle-rules-page-routes';
import { battleRulesRouteMetas } from './battle-rules-resources';

it('keeps battle rule menu metas aligned with page routes', () => {
  const routePaths = battleRulesPageRoutes.map((route) => route.path);
  const metaRoutePaths = battleRulesRouteMetas.map((meta) =>
    meta.path.replace('/battle-rules/', ''),
  );

  expect(routePaths).toEqual(metaRoutePaths);
  expect(battleRulesRouteMetas.map((meta) => meta.componentKey)).toEqual(
    metaRoutePaths.map((path) => `battle-rules/${path}`),
  );
  battleRulesPageRoutes.forEach((route) => {
    expect(isValidElement(route.element)).toBe(true);
  });
});
