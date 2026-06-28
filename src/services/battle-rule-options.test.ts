import { expect, it, vi } from 'vitest';
import { createBattleRuleOptionServices } from './battle-rule-options';

it('loads explicit reference option endpoints for battle rule pages', async () => {
  const request = vi.fn().mockResolvedValue({ rows: [] });
  const services = createBattleRuleOptionServices(request);
  const query = { page: 0, size: 100, q: '妙蛙' };

  await services.skills(query);
  await services.abilities(query);
  await services.items(query);
  await services.stats(query);

  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/game-data/skills', {
    params: { query },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'GET', '/api/game-data/abilities', {
    params: { query },
  });
  expect(request).toHaveBeenNthCalledWith(3, 'GET', '/api/game-data/items', {
    params: { query },
  });
  expect(request).toHaveBeenNthCalledWith(4, 'GET', '/api/game-data/stats', {
    params: { query },
  });
});
