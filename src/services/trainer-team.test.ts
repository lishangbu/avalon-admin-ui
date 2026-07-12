import { beforeEach, expect, it, vi } from 'vitest';
import { apiRequest } from './client';
import { trainerTeamService } from './trainer-team';

vi.mock('./client', () => ({ apiRequest: vi.fn() }));

beforeEach(() => vi.mocked(apiRequest).mockReset());

it('uses the authenticated trainer team read and complete replacement contract', async () => {
  vi.mocked(apiRequest).mockResolvedValue({});
  const command = {
    expectedRevision: null,
    members: [
      {
        creatureId: '1',
        skillIds: ['14'],
        abilityId: '65',
        itemId: '1',
        natureId: '1',
        individualValues: {},
        effortValues: {},
      },
    ],
  };

  await trainerTeamService.get();
  await trainerTeamService.save(command);

  expect(apiRequest).toHaveBeenNthCalledWith(1, 'GET', '/api/player/trainer-team', {
    requiresTrainerSession: true,
  });
  expect(apiRequest).toHaveBeenNthCalledWith(2, 'PUT', '/api/player/trainer-team', {
    body: command,
    requiresTrainerSession: true,
  });
});
