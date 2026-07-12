import { beforeEach, expect, it, vi } from 'vitest';
import { apiRequest } from './client';
import { challengeService } from './challenges';

vi.mock('./client', () => ({ apiRequest: vi.fn() }));
beforeEach(() => vi.mocked(apiRequest).mockReset());

it('uses trainer-session authenticated challenge lifecycle endpoints', async () => {
  vi.mocked(apiRequest).mockResolvedValue({});
  const command = {
    commandId: '00000000-0000-4000-8000-000000000001',
    challengedDisplayName: 'Target',
    leadPosition: 1,
  };

  await challengeService.list();
  await challengeService.create(command);
  await challengeService.find('21');
  await challengeService.reject('21', 0);
  await challengeService.accept('21', 0, 1);
  await challengeService.withdraw('21', 0);

  expect(apiRequest).toHaveBeenNthCalledWith(1, 'GET', '/api/player/challenges', {
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(2, 'POST', '/api/player/challenges', {
    body: command,
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(
    4,
    'POST',
    '/api/player/challenges/{challengeId}/reject',
    {
      params: { path: { challengeId: '21' } },
      body: { expectedRevision: 0 },
      requiresTrainerSession: true,
    },
  );
  expect(apiRequest).toHaveBeenNthCalledWith(
    5,
    'POST',
    '/api/player/challenges/{challengeId}/accept',
    {
      params: { path: { challengeId: '21' } },
      body: { expectedRevision: 0, leadPosition: 1 },
      requiresTrainerSession: true,
    },
  );
});
