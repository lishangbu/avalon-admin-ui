import { isValidElement } from 'react';
import { expect, it } from 'vitest';
import { gameDataPageRoutes } from './game-data-page-routes';

it('keeps game data page routes unique and renderable', () => {
  const routePaths = gameDataPageRoutes.map((route) => route.path);

  expect(new Set(routePaths).size).toBe(routePaths.length);
  gameDataPageRoutes.forEach((route) => {
    expect(isValidElement(route.element)).toBe(true);
  });
});
