import { beforeEach, expect, it, vi } from 'vitest';
import { apiRequest } from './client';
import { trainerService } from './trainers';

vi.mock('./client', () => ({ apiRequest: vi.fn() }));

beforeEach(() => vi.mocked(apiRequest).mockReset());

it('uses player trainer contract for list and create', async () => {
  vi.stubGlobal('crypto', { randomUUID: () => 'command-id' });
  vi.mocked(apiRequest)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce({ id: '1' });

  await trainerService.list();
  await trainerService.listArchived();
  await trainerService.create('Avalon一号');

  expect(apiRequest).toHaveBeenNthCalledWith(1, 'GET', '/api/player/trainers');
  expect(apiRequest).toHaveBeenNthCalledWith(2, 'GET', '/api/player/trainers/archived');
  expect(apiRequest).toHaveBeenNthCalledWith(3, 'POST', '/api/player/trainers', {
    body: { commandId: 'command-id', displayName: 'Avalon一号' },
  });
});
