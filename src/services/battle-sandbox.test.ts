import { expect, it, vi } from 'vitest';
import { createBattleSandboxService, type BattleSandboxTurnRequest } from './battle-sandbox';

it('posts one-turn sandbox request to independent battle sandbox api', async () => {
  const request = vi.fn().mockResolvedValue({ resolved: true, events: [] });
  const service = createBattleSandboxService(request);
  const body: BattleSandboxTurnRequest = {
    formatCode: 'standard-single',
    randomSeed: 0,
    sides: [],
    actions: [],
  };

  await service.resolveTurn(body);

  expect(request).toHaveBeenCalledWith('POST', '/api/battle-sandbox/turn', { body });
});

it('uses battle sandbox replay resource endpoints', async () => {
  const request = vi.fn().mockResolvedValue({ rows: [], totalRowCount: 0 });
  const service = createBattleSandboxService(request);
  const body = {
    title: '接口测试复盘',
    formatCode: 'standard-single',
    responseJson: '{"turnNumber":1}',
  };

  await service.listReplays({ page: 1, size: 8, q: '接口' });
  await service.createReplay(body);
  await service.getReplay(12);
  await service.deleteReplay(12);

  expect(request).toHaveBeenNthCalledWith(1, 'GET', '/api/battle-sandbox/replays', {
    params: { query: { page: 1, size: 8, q: '接口' } },
  });
  expect(request).toHaveBeenNthCalledWith(2, 'POST', '/api/battle-sandbox/replays', { body });
  expect(request).toHaveBeenNthCalledWith(3, 'GET', '/api/battle-sandbox/replays/12');
  expect(request).toHaveBeenNthCalledWith(4, 'DELETE', '/api/battle-sandbox/replays/12', {
    allowEmptyResponse: true,
  });
});
