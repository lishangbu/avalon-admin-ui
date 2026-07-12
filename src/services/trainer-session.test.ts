import { beforeEach, expect, it, vi } from 'vitest';
import { apiRequest } from './client';
import { trainerSessionService } from './trainer-session';

vi.mock('./client', () => ({ apiRequest: vi.fn() }));

beforeEach(() => vi.mocked(apiRequest).mockReset());

it('uses the enter current and leave Trainer Session contract', async () => {
  vi.mocked(apiRequest).mockResolvedValue(undefined);

  await trainerSessionService.enter('11');
  await trainerSessionService.current();
  await trainerSessionService.leave();

  expect(apiRequest).toHaveBeenNthCalledWith(1, 'POST', '/api/player/trainer-session', {
    body: { trainerId: '11' },
  });
  expect(apiRequest).toHaveBeenNthCalledWith(2, 'GET', '/api/player/trainer-session', {
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(3, 'DELETE', '/api/player/trainer-session', {
    requiresTrainerSession: true,
    allowEmptyResponse: true,
  });
});
