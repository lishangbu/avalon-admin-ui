import { beforeEach, expect, it, vi } from 'vitest';
import { apiRequest } from './client';
import { matchService } from './matches';

vi.mock('./client', () => ({ apiRequest: vi.fn() }));
beforeEach(() => vi.mocked(apiRequest).mockReset());

it('uses Trainer Session authenticated Match View endpoints', async () => {
  vi.mocked(apiRequest).mockResolvedValue({});
  await matchService.current();
  await matchService.find('61');
  await matchService.history();
  await matchService.historyDetail('61');
  await matchService.archivedHistory('11');
  await matchService.archivedHistoryDetail('11', '61');
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
  expect(apiRequest).toHaveBeenNthCalledWith(3, 'GET', '/api/player/matches/history', {
    params: { query: { beforeMatchId: undefined, limit: 20 } },
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(4, 'GET', '/api/player/matches/history/{matchId}', {
    params: { path: { matchId: '61' } },
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(
    5,
    'GET',
    '/api/player/trainers/{trainerId}/match-history',
    {
      params: { path: { trainerId: '11' }, query: { beforeMatchId: undefined, limit: 20 } },
    },
  );
  expect(apiRequest).toHaveBeenNthCalledWith(
    6,
    'GET',
    '/api/player/trainers/{trainerId}/match-history/{matchId}',
    {
      params: { path: { trainerId: '11', matchId: '61' } },
    },
  );
  expect(apiRequest).toHaveBeenNthCalledWith(7, 'POST', '/api/player/matches/{matchId}/turns', {
    params: { path: { matchId: '61' } },
    body: command,
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(8, 'POST', '/api/player/matches/{matchId}/forfeit', {
    params: { path: { matchId: '61' } },
    body: { expectedRevision: 1 },
    requiresTrainerSession: true,
  });
});

it('forwards opaque Match cursors for active and archived history', async () => {
  vi.mocked(apiRequest).mockResolvedValue([]);
  await matchService.history('9007199254740993123', 20);
  await matchService.archivedHistory('11', '9007199254740993123', 20);
  expect(apiRequest).toHaveBeenNthCalledWith(1, 'GET', '/api/player/matches/history', {
    params: { query: { beforeMatchId: '9007199254740993123', limit: 20 } },
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(
    2,
    'GET',
    '/api/player/trainers/{trainerId}/match-history',
    {
      params: {
        path: { trainerId: '11' },
        query: { beforeMatchId: '9007199254740993123', limit: 20 },
      },
    },
  );
});
