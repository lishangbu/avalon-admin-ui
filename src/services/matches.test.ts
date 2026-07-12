import { beforeEach, expect, it, vi } from 'vitest';
import { apiRequest } from './client';
import { matchService } from './matches';

vi.mock('./client', () => ({ apiRequest: vi.fn() }));
beforeEach(() => vi.mocked(apiRequest).mockReset());

it('uses Trainer Session authenticated Match View endpoints', async () => {
  vi.mocked(apiRequest).mockResolvedValue({});
  await matchService.current();
  await matchService.find('61');
  const command = {
    submissionId: '00000000-0000-4000-8000-000000000001',
    expectedRevision: 1,
    actions: [],
  };
  await matchService.submitTurn('61', command);
  await matchService.forfeit('61', 1);
  expect(apiRequest).toHaveBeenNthCalledWith(1, 'GET', '/api/player/matches/current', {
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(2, 'GET', '/api/player/matches/{matchId}', {
    params: { path: { matchId: '61' } },
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(3, 'POST', '/api/player/matches/{matchId}/turns', {
    params: { path: { matchId: '61' } },
    body: command,
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(4, 'POST', '/api/player/matches/{matchId}/forfeit', {
    params: { path: { matchId: '61' } },
    body: { expectedRevision: 1 },
    requiresTrainerSession: true,
  });
});
