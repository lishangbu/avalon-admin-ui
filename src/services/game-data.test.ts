import { expect, it, vi } from 'vitest';
import { createCreaturesGameDataService } from './game-data/creatures';
import type { ApiRequest } from './client';

it('calls whitelisted game data resource paths', async () => {
  const request = vi.fn(async (method, path) => {
    if (method === 'GET' && path === '/api/game-data/creatures') {
      return {
        rows: [{ id: 1, code: 'bulbasaur', name: '妙蛙种子' }],
        totalRowCount: 1,
        totalPageCount: 1,
        page: 0,
        size: 20,
      };
    }
    return { id: 1, code: 'bulbasaur' };
  }) as ApiRequest;
  const service = createCreaturesGameDataService(request);

  const page = await service.list({ page: 0, size: 20 });
  await service.update(1, { name: '妙蛙种子' });

  expect(page.rows[0]?.name).toBe('妙蛙种子');
  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/game-data/creatures', {
    params: { query: { page: 0, size: 20 } },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'PUT', '/api/game-data/creatures/{id}', {
    params: { path: { id: 1 } },
    body: { name: '妙蛙种子' },
  });
});
