import { expect, it, vi } from 'vitest';
import { createGameDataServices } from './game-data';
import type { ApiRequest } from './client';

it('calls whitelisted game data resource paths', async () => {
  const request = vi.fn(async (method, path) => {
    if (method === 'GET' && path === '/api/game-data/creatures') {
      return {
        rows: [{ id: 1, fields: { code: 'bulbasaur', name: '妙蛙种子' } }],
        totalRowCount: 1,
        totalPageCount: 1,
        page: 0,
        size: 20,
      };
    }
    return { id: 1, fields: { code: 'bulbasaur' } };
  }) as ApiRequest;
  const services = createGameDataServices(request);

  const page = await services.list('creatures', { page: 0, size: 20 });
  await services.update('creatures', 1, { name: '妙蛙种子' });

  expect(page.rows[0]?.fields.name).toBe('妙蛙种子');
  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/game-data/creatures', {
    params: { query: { page: 0, size: 20 } },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'PUT', '/api/game-data/creatures/{id}', {
    params: { path: { id: 1 } },
    body: { fields: { name: '妙蛙种子' } },
  });
});
