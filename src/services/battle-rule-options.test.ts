import { expect, it, vi } from 'vitest';
import { createBattleRuleOptionServices } from './battle-rule-options';

it('loads explicit reference option endpoints for battle rule pages', async () => {
  const request = vi.fn().mockResolvedValue({ rows: [] });
  const services = createBattleRuleOptionServices(request);
  const query = { page: 0, size: 100, q: '妙蛙' };

  await services.creatures(query);
  await services.skills(query);
  await services.elements(query);
  await services.abilities(query);
  await services.items(query);
  await services.stats(query);

  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/game-data/creatures', {
    params: { query },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'GET', '/api/game-data/skills', {
    params: { query },
  });
  expect(request).toHaveBeenNthCalledWith(3, 'GET', '/api/game-data/elements', {
    params: { query },
  });
  expect(request).toHaveBeenNthCalledWith(4, 'GET', '/api/game-data/abilities', {
    params: { query },
  });
  expect(request).toHaveBeenNthCalledWith(5, 'GET', '/api/game-data/items', {
    params: { query },
  });
  expect(request).toHaveBeenNthCalledWith(6, 'GET', '/api/game-data/stats', {
    params: { query },
  });
});

it('splits oversized reference option queries into backend-sized pages', async () => {
  const request = vi.fn(
    async (
      _method: string,
      _path: string,
      options: { params: { query: { page?: number; size?: number } } },
    ) => {
      const page = Number(options.params.query.page);
      const size = Number(options.params.query.size);
      const rows = Array.from({ length: page === 2 ? 50 : size }, (_, index) => ({
        id: page * size + index + 1,
        name: `技能${page * size + index + 1}`,
      }));

      return {
        rows,
        totalRowCount: 250,
        totalPageCount: 3,
        page,
        size,
      };
    },
  );
  const services = createBattleRuleOptionServices(request);

  const page = await services.skills({ page: 0, size: 250 });

  expect(page.rows).toHaveLength(250);
  expect(page.rows?.at(0)?.name).toBe('技能1');
  expect(page.rows?.at(-1)?.name).toBe('技能250');
  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/game-data/skills', {
    params: { query: { page: 0, size: 100 } },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'GET', '/api/game-data/skills', {
    params: { query: { page: 1, size: 100 } },
  });
  expect(request).toHaveBeenNthCalledWith(3, 'GET', '/api/game-data/skills', {
    params: { query: { page: 2, size: 100 } },
  });
});
