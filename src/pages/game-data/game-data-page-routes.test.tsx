import { isValidElement } from 'react';
import { expect, it } from 'vitest';
import { gameDataPageRoutes } from './game-data-page-routes';
import { gameDataRouteMetas } from './game-data-resources';

it('keeps game data menu metas aligned with page routes', () => {
  const routePaths = gameDataPageRoutes.map((route) => route.path);
  const metaRoutePaths = gameDataRouteMetas.map((meta) => meta.path.replace('/game-data/', ''));

  expect(routePaths).toEqual(metaRoutePaths);
  expect(gameDataRouteMetas.map((meta) => meta.componentKey)).toEqual(
    metaRoutePaths.map((path) => `game-data/${path}`),
  );
  gameDataPageRoutes.forEach((route) => {
    expect(isValidElement(route.element)).toBe(true);
  });
});
