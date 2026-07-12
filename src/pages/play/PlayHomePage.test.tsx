import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { trainerService } from '../../services/trainers';
import { trainerSessionService } from '../../services/trainer-session';
import { trainerTeamService } from '../../services/trainer-team';
import { PlayHomePage } from './PlayHomePage';
import {
  clearTrainerSessionCredential,
  readTrainerSessionCredential,
  saveTrainerSessionCredential,
} from '../../app/auth/trainer-session-storage';
import { ApiError } from '../../shared/api/errors';

vi.mock('../../app/auth/AuthProvider', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    session: { user: { username: 'player', displayName: '玩家一号' } },
  }),
}));

beforeEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
  clearTrainerSessionCredential();
});

it('enters a server Trainer Session and exposes its authenticated state', async () => {
  const user = userEvent.setup();
  vi.spyOn(trainerService, 'list').mockResolvedValue([
    { id: '11', displayName: 'Avalon一号', revision: 0, archivedAt: null },
  ]);
  const serverSession = {
    credential: 'trainer-credential',
    expiresAt: '2026-07-12T00:30:00Z',
    trainer: { id: '11', displayName: 'Avalon一号', revision: 0, archivedAt: null },
  };
  vi.spyOn(trainerSessionService, 'enter').mockResolvedValue(serverSession);
  vi.spyOn(trainerSessionService, 'current').mockResolvedValue(serverSession);

  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <PlayHomePage />
    </QueryClientProvider>,
  );

  await user.click(await screen.findByRole('button', { name: '选择 Trainer' }));
  expect(
    await screen.findByText('Trainer Session 已建立，可以继续维护队伍并发起挑战。'),
  ).toBeInTheDocument();
  expect(trainerSessionService.enter).toHaveBeenCalledWith('11');
  expect(readTrainerSessionCredential()).toBe('trainer-credential');
  expect(screen.getByRole('button', { name: '退出当前 Trainer' })).toBeInTheDocument();
});

it('creates the complete team for the authenticated Trainer', async () => {
  const user = userEvent.setup();
  saveTrainerSessionCredential('trainer-credential');
  vi.spyOn(trainerService, 'list').mockResolvedValue([]);
  vi.spyOn(trainerSessionService, 'current').mockResolvedValue({
    credential: 'trainer-credential',
    expiresAt: '2026-07-12T00:30:00Z',
    trainer: { id: '11', displayName: 'TeamPlayer', revision: 0, archivedAt: null },
  });
  vi.spyOn(trainerTeamService, 'get').mockRejectedValue(
    new ApiError({ code: 'trainer-team.not-found' }),
  );
  vi.spyOn(trainerTeamService, 'save').mockResolvedValue({
    id: '21',
    trainerId: '11',
    revision: 0,
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
  });

  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <PlayHomePage />
    </QueryClientProvider>,
  );

  await user.click(await screen.findByRole('button', { name: '添加 Team 成员' }));
  await user.type(screen.getByLabelText('精灵 ID'), '1');
  await user.type(screen.getByLabelText('技能 ID'), '14');
  await user.type(screen.getByLabelText('特性 ID'), '65');
  await user.type(screen.getByLabelText('道具 ID'), '1');
  await user.type(screen.getByLabelText('性格 ID'), '1');
  await user.click(screen.getByRole('button', { name: '保存 Team' }));

  expect(vi.mocked(trainerTeamService.save).mock.calls[0]?.[0]).toEqual({
    expectedRevision: null,
    members: [
      expect.objectContaining({
        creatureId: '1',
        skillIds: ['14'],
        abilityId: '65',
        itemId: '1',
        natureId: '1',
      }),
    ],
  });
  expect(await screen.findByText('Team 已保存，版本 0')).toBeInTheDocument();
});

it('rejects canonically duplicated skill identifiers before saving the team', async () => {
  const user = userEvent.setup();
  saveTrainerSessionCredential('trainer-credential');
  vi.spyOn(trainerService, 'list').mockResolvedValue([]);
  vi.spyOn(trainerSessionService, 'current').mockResolvedValue({
    credential: 'trainer-credential',
    expiresAt: '2026-07-12T00:30:00Z',
    trainer: { id: '11', displayName: 'TeamPlayer', revision: 0, archivedAt: null },
  });
  vi.spyOn(trainerTeamService, 'get').mockRejectedValue(
    new ApiError({ code: 'trainer-team.not-found' }),
  );
  const saveTeam = vi.spyOn(trainerTeamService, 'save');

  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <PlayHomePage />
    </QueryClientProvider>,
  );

  await user.click(await screen.findByRole('button', { name: '添加 Team 成员' }));
  await user.type(screen.getByLabelText('精灵 ID'), '1');
  await user.type(screen.getByLabelText('技能 ID'), '14, 014');
  await user.type(screen.getByLabelText('特性 ID'), '65');
  await user.click(screen.getByRole('button', { name: '保存 Team' }));

  expect(await screen.findByText('请输入 1–4 个不重复的技能 ID')).toBeInTheDocument();
  expect(saveTeam).not.toHaveBeenCalled();
});
