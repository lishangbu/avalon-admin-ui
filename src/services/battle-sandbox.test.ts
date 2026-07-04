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
