import { beforeEach, expect, it, vi } from 'vitest';
import { apiRequest } from './client';
import { publicTrainerService } from './public-trainers';

vi.mock('./client', () => ({ apiRequest: vi.fn() }));

beforeEach(() => vi.mocked(apiRequest).mockReset());

it('looks up an exact public trainer through the authenticated trainer session', async () => {
  vi.mocked(apiRequest).mockResolvedValue({});

  await publicTrainerService.find('PublicTarget');

  expect(apiRequest).toHaveBeenCalledWith('GET', '/api/player/public-trainers', {
    params: { query: { displayName: 'PublicTarget' } },
    requiresTrainerSession: true,
  });
});
