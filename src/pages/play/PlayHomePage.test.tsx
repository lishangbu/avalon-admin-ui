import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { trainerService } from '../../services/trainers';
import { trainerSessionService } from '../../services/trainer-session';
import { trainerTeamService } from '../../services/trainer-team';
import { publicTrainerService } from '../../services/public-trainers';
import { challengeService } from '../../services/challenges';
import { matchService } from '../../services/matches';
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
  vi.spyOn(trainerService, 'listArchived').mockResolvedValue([]);
  vi.spyOn(trainerSessionService, 'heartbeat').mockResolvedValue();
  vi.spyOn(challengeService, 'list').mockResolvedValue([]);
  vi.spyOn(matchService, 'history').mockResolvedValue([]);
  vi.spyOn(matchService, 'current').mockRejectedValue(
    new ApiError({ code: 'match.current.not-found' }),
  );
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
  vi.mocked(trainerService.listArchived).mockResolvedValue([
    { id: '12', displayName: '归档骑士', revision: 1, archivedAt: '2026-07-11T00:00:00Z' },
  ]);
  const archivedHistory = vi.spyOn(matchService, 'archivedHistory').mockResolvedValue([
    {
      id: '71',
      opponentDisplayName: '旧对手',
      status: 'COMPLETED',
      result: 'WIN',
      turnNumber: 4,
      startedAt: '2026-07-10T00:00:00Z',
      endedAt: '2026-07-10T00:04:00Z',
    },
  ]);
  const archivedHistoryDetail = vi.spyOn(matchService, 'archivedHistoryDetail').mockResolvedValue({
    id: '71',
    ruleCode: 'standard-single',
    status: 'COMPLETED',
    revision: 4,
    turnNumber: 4,
    turnDeadline: null,
    requirements: [],
    result: 'WIN',
    completionReason: 'BATTLE',
    sides: [],
  });

  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <PlayHomePage />
    </QueryClientProvider>,
  );

  await user.click(await screen.findByRole('button', { name: '查看历史' }));
  await vi.waitFor(() => expect(archivedHistory).toHaveBeenCalledWith('12', undefined));
  expect(await screen.findByText('WIN · 旧对手')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '查看详情' }));
  await vi.waitFor(() => expect(archivedHistoryDetail).toHaveBeenCalledWith('12', '71'));
  expect(await screen.findByText('历史详情 · 71')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '选择 Trainer' }));
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

it('finds an exact public trainer without exposing internal identifiers', async () => {
  const user = userEvent.setup();
  saveTrainerSessionCredential('trainer-credential');
  vi.spyOn(trainerService, 'list').mockResolvedValue([]);
  vi.spyOn(trainerSessionService, 'current').mockResolvedValue({
    credential: 'trainer-credential',
    expiresAt: '2026-07-12T00:30:00Z',
    trainer: { id: '11', displayName: 'Searcher', revision: 0, archivedAt: null },
  });
  vi.spyOn(trainerTeamService, 'get').mockRejectedValue(
    new ApiError({ code: 'trainer-team.not-found' }),
  );
  const findTrainer = vi.spyOn(publicTrainerService, 'find').mockResolvedValue({
    displayName: 'PublicTarget',
    online: true,
    challengeable: true,
  });

  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <PlayHomePage />
    </QueryClientProvider>,
  );

  await user.type(await screen.findByLabelText('Trainer 名称'), 'PublicTarget');
  await user.click(screen.getByRole('button', { name: '精确查找' }));

  expect(findTrainer.mock.calls[0]?.[0]).toBe('PublicTarget');
  expect(await screen.findByText('当前在线，可以发起挑战')).toBeInTheDocument();
  expect(screen.queryByText('11')).not.toBeInTheDocument();
});

it('heartbeats every fifteen seconds and stops after leaving the trainer session', async () => {
  vi.useFakeTimers();
  try {
    saveTrainerSessionCredential('trainer-credential');
    vi.spyOn(trainerService, 'list').mockResolvedValue([]);
    vi.spyOn(trainerSessionService, 'current').mockResolvedValue({
      credential: 'trainer-credential',
      expiresAt: '2026-07-12T00:30:00Z',
      trainer: { id: '11', displayName: 'HeartbeatPlayer', revision: 0, archivedAt: null },
    });
    vi.spyOn(trainerSessionService, 'leave').mockResolvedValue();
    vi.spyOn(trainerTeamService, 'get').mockRejectedValue(
      new ApiError({ code: 'trainer-team.not-found' }),
    );
    const heartbeat = vi.mocked(trainerSessionService.heartbeat);

    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <PlayHomePage />
      </QueryClientProvider>,
    );

    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(heartbeat).toHaveBeenCalledTimes(1);
    await act(async () => vi.advanceTimersByTimeAsync(15_000));
    expect(heartbeat).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByRole('button', { name: '退出当前 Trainer' }));
    await act(async () => vi.advanceTimersByTimeAsync(1));
    await act(async () => vi.advanceTimersByTimeAsync(15_000));
    expect(heartbeat).toHaveBeenCalledTimes(2);
  } finally {
    vi.useRealTimers();
  }
});

it('clears the trainer credential when heartbeat authentication expires', async () => {
  saveTrainerSessionCredential('expired-credential');
  vi.spyOn(trainerService, 'list').mockResolvedValue([]);
  vi.spyOn(trainerSessionService, 'current').mockResolvedValue({
    credential: 'expired-credential',
    expiresAt: '2026-07-12T00:30:00Z',
    trainer: { id: '11', displayName: 'ExpiredPlayer', revision: 0, archivedAt: null },
  });
  vi.mocked(trainerSessionService.heartbeat).mockRejectedValue(
    new ApiError({ code: 'trainer-session.invalid' }),
  );
  vi.spyOn(trainerTeamService, 'get').mockRejectedValue(
    new ApiError({ code: 'trainer-team.not-found' }),
  );

  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <PlayHomePage />
    </QueryClientProvider>,
  );

  expect(await screen.findByText('选择 Trainer')).toBeInTheDocument();
  expect(readTrainerSessionCredential()).toBeNull();
});

it('creates and resolves private challenges through the current trainer session', async () => {
  const user = userEvent.setup();
  saveTrainerSessionCredential('trainer-credential');
  vi.spyOn(trainerService, 'list').mockResolvedValue([
    { id: '12', displayName: 'ChallengeDelta', revision: 0, archivedAt: null },
  ]);
  vi.spyOn(trainerSessionService, 'current').mockResolvedValue({
    credential: 'trainer-credential',
    expiresAt: '2026-07-12T00:30:00Z',
    trainer: { id: '11', displayName: 'ChallengeAlpha', revision: 0, archivedAt: null },
  });
  vi.spyOn(trainerSessionService, 'leave').mockResolvedValue();
  vi.spyOn(trainerSessionService, 'enter').mockResolvedValue({
    credential: 'trainer-credential-b',
    expiresAt: '2026-07-12T00:30:00Z',
    trainer: { id: '12', displayName: 'ChallengeDelta', revision: 0, archivedAt: null },
  });
  vi.spyOn(trainerTeamService, 'get').mockResolvedValue({
    id: '31',
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
  const pending = {
    id: '41',
    direction: 'INCOMING' as const,
    challengerDisplayName: 'ChallengeBeta',
    challengedDisplayName: 'ChallengeAlpha',
    ruleCode: 'standard-single',
    teamSize: 1,
    status: 'PENDING' as const,
    revision: 0,
    expiresAt: '2026-07-12T00:05:00Z',
    createdAt: '2026-07-12T00:00:00Z',
  };
  const other = {
    ...pending,
    id: '40',
    status: 'REJECTED' as const,
    revision: 1,
    challengerDisplayName: 'Previous',
    resolvedAt: '2026-07-11T23:59:00Z',
  };
  const rejected = {
    ...pending,
    status: 'REJECTED',
    revision: 1,
    resolvedAt: '2026-07-12T00:01:00Z',
  } as const;
  const created = {
    ...pending,
    id: '42',
    direction: 'OUTGOING',
    challengerDisplayName: 'ChallengeAlpha',
    challengedDisplayName: 'ChallengeGamma',
  } as const;
  vi.mocked(challengeService.list)
    .mockResolvedValueOnce([pending, other])
    .mockResolvedValue([rejected, other, created]);
  const reject = vi.spyOn(challengeService, 'reject').mockResolvedValue(rejected);
  vi.spyOn(challengeService, 'find').mockResolvedValue(pending);
  const create = vi
    .spyOn(challengeService, 'create')
    .mockRejectedValueOnce(new ApiError({ code: 'network.unknown-result' }))
    .mockRejectedValueOnce(new ApiError({ code: 'network.unknown-result' }))
    .mockResolvedValue(created);

  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <PlayHomePage />
    </QueryClientProvider>,
  );

  expect(await screen.findByText(/ChallengeBeta.*ChallengeAlpha/)).toBeInTheDocument();
  expect(screen.getByText(/Previous.*ChallengeAlpha/)).toBeInTheDocument();
  await user.click(screen.getAllByRole('button', { name: '查看详情' })[0]);
  expect(await screen.findByText(/到期时间：2026-07-12T00:05:00Z/)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /拒\s*绝/ }));
  expect(reject.mock.calls[0]).toEqual(['41', 0]);
  expect(
    await screen.findByRole('heading', { name: /ChallengeBeta.*REJECTED/ }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Previous.*ChallengeAlpha/)).toBeInTheDocument();

  await user.type(screen.getByLabelText('目标 Trainer'), 'ChallengeGamma');
  await user.click(screen.getByRole('button', { name: '发起 Challenge' }));
  expect(
    await screen.findByText('Challenge 发起失败，请确认目标在线且当前可挑战'),
  ).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '发起 Challenge' }));
  await vi.waitFor(() => expect(create).toHaveBeenCalledTimes(2));
  expect(create.mock.calls[0]?.[0]).toEqual(
    expect.objectContaining({
      challengedDisplayName: 'ChallengeGamma',
      leadPosition: 1,
    }),
  );
  expect(create.mock.calls[1]?.[0].commandId).toBe(create.mock.calls[0]?.[0].commandId);

  await user.click(screen.getByRole('button', { name: '退出当前 Trainer' }));
  await user.click(await screen.findByRole('button', { name: '选择 Trainer' }));
  await user.type(await screen.findByLabelText('目标 Trainer'), 'ChallengeGamma');
  await user.click(screen.getByRole('button', { name: '发起 Challenge' }));
  await vi.waitFor(() => expect(create).toHaveBeenCalledTimes(3));
  expect(create.mock.calls[2]?.[0].commandId).not.toBe(create.mock.calls[0]?.[0].commandId);
  expect(await screen.findByText(/ChallengeAlpha.*ChallengeGamma/)).toBeInTheDocument();
  expect(screen.getByText(/Previous.*ChallengeAlpha/)).toBeInTheDocument();
}, 10_000);

it('accepts an incoming challenge and exposes the started match without runtime identifiers', async () => {
  const user = userEvent.setup();
  saveTrainerSessionCredential('trainer-credential');
  vi.spyOn(trainerService, 'list').mockResolvedValue([]);
  vi.spyOn(trainerSessionService, 'current').mockResolvedValue({
    credential: 'trainer-credential',
    expiresAt: '2026-07-12T00:30:00Z',
    trainer: { id: '11', displayName: 'MatchBeta', revision: 0, archivedAt: null },
  });
  vi.spyOn(trainerTeamService, 'get').mockResolvedValue({
    id: '31',
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
  const challenge = {
    id: '51',
    direction: 'INCOMING' as const,
    challengerDisplayName: 'MatchAlpha',
    challengedDisplayName: 'MatchBeta',
    ruleCode: 'standard-single',
    teamSize: 1,
    status: 'PENDING' as const,
    revision: 0,
    expiresAt: '2026-07-12T00:05:00Z',
    createdAt: '2026-07-12T00:00:00Z',
  };
  vi.mocked(challengeService.list)
    .mockResolvedValueOnce([challenge])
    .mockResolvedValue([{ ...challenge, status: 'ACCEPTED', revision: 1 }]);
  const startedMatch = {
    id: '61',
    ruleCode: 'standard-single',
    status: 'ACTIVE',
    revision: 1,
    turnNumber: 0,
    turnDeadline: '2026-07-12T00:01:30Z',
    participants: [
      { displayName: 'MatchAlpha', you: false },
      { displayName: 'MatchBeta', you: true },
    ],
    startedAt: '2026-07-12T00:00:00Z',
  } as const;
  const accept = vi.spyOn(challengeService, 'accept').mockResolvedValue(startedMatch);
  const initialMatch = {
    id: '61',
    ruleCode: 'standard-single',
    status: 'ACTIVE',
    revision: 1,
    turnNumber: 0,
    turnDeadline: '2026-07-12T00:01:30Z',
    requirements: [
      {
        actorPosition: 1,
        options: [{ type: 'USE_SKILL', skillId: '14', targetPosition: 1, targetYou: true }],
      },
    ],
    sides: [
      {
        displayName: 'MatchAlpha',
        you: false,
        participants: [{ position: 1, creatureId: '1', active: true, currentHp: 120, maxHp: 120 }],
      },
      {
        displayName: 'MatchBeta',
        you: true,
        participants: [
          {
            position: 1,
            creatureId: '1',
            active: true,
            currentHp: 120,
            maxHp: 120,
            skillIds: ['14'],
          },
        ],
      },
    ],
  } as const;
  vi.mocked(matchService.current).mockResolvedValue(initialMatch);
  const submitTurn = vi.spyOn(matchService, 'submitTurn').mockResolvedValue({ locked: true });
  const completedMatch = {
    ...initialMatch,
    status: 'COMPLETED' as const,
    revision: 3,
    turnDeadline: null,
    requirements: [],
    result: 'LOSS' as const,
    completionReason: 'FORFEIT' as const,
  };
  const firstHistoryPage = Array.from({ length: 20 }, (_, index) => ({
    id: String(61 - index),
    opponentDisplayName: index === 0 ? 'MatchAlpha' : `MatchOpponent${index}`,
    status: 'COMPLETED' as const,
    result: 'LOSS' as const,
    startedAt: '2026-07-12T00:00:00Z',
    endedAt: '2026-07-12T00:02:00Z',
    turnNumber: 1,
  }));
  vi.mocked(matchService.history)
    .mockResolvedValueOnce(firstHistoryPage)
    .mockResolvedValueOnce([
      { ...firstHistoryPage[0]!, id: '41', opponentDisplayName: 'OlderOpponent' },
    ])
    .mockResolvedValue([]);
  const historyDetail = vi.spyOn(matchService, 'historyDetail').mockResolvedValue(completedMatch);
  const forfeit = vi
    .spyOn(matchService, 'forfeit')
    .mockRejectedValueOnce(new Error('temporary failure'))
    .mockResolvedValueOnce(completedMatch);

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={queryClient}>
      <PlayHomePage />
    </QueryClientProvider>,
  );

  await user.click(await screen.findByRole('button', { name: /接\s*受/ }));
  expect(accept.mock.calls[0]).toEqual(['51', 0, 1]);
  expect(await screen.findByText('Match ACTIVE')).toBeInTheDocument();
  expect(
    queryClient.getQueryData(['player', 'match', 'current-reference', 'trainer-credential']),
  ).toBe('61');
  expect(await screen.findByText('己方 · MatchBeta')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /技能 14.*己方 #1/ }));
  await user.click(screen.getByRole('button', { name: '锁定本回合行动' }));
  await vi.waitFor(() => expect(submitTurn).toHaveBeenCalledTimes(1));
  expect(submitTurn.mock.calls[0]?.[0]).toBe('61');
  expect(submitTurn.mock.calls[0]?.[1]).toMatchObject({
    expectedRevision: 1,
    actions: [
      { actorPosition: 1, type: 'USE_SKILL', skillId: '14', targetPosition: 1, targetYou: true },
    ],
  });
  expect(await screen.findByText('本回合行动已锁定')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /技能 14.*己方 #1/ })).toBeDisabled();
  expect(screen.getByRole('button', { name: '锁定本回合行动' })).toBeDisabled();
  vi.mocked(matchService.current).mockResolvedValue({
    ...initialMatch,
    revision: 2,
    turnNumber: 1,
  });
  expect(
    await screen.findByText('Match ACTIVE · Turn 1', {}, { timeout: 3_000 }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /技能 14.*己方 #1/ })).toBeEnabled();
  expect(screen.getByRole('button', { name: /认\s*输/ })).toBeInTheDocument();
  await vi.waitFor(() => expect(challengeService.list).toHaveBeenCalledTimes(2));
  expect(await screen.findByText('ACCEPTED')).toBeInTheDocument();
  expect(screen.queryByText(/battleSession/i)).not.toBeInTheDocument();
  expect(await screen.findByText('LOSS · MatchAlpha')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '加载更早记录' }));
  await vi.waitFor(() => expect(matchService.history).toHaveBeenCalledWith('42'));
  expect(await screen.findByText('LOSS · OlderOpponent')).toBeInTheDocument();
  await user.click(screen.getAllByRole('button', { name: '查看详情' })[0]!);
  await vi.waitFor(() => expect(historyDetail).toHaveBeenCalledWith('61'));
  expect(await screen.findByText('历史详情 · 61')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /认.*输/ }));
  await user.click(await screen.findByRole('button', { name: 'OK' }));
  expect(await screen.findByText('认输失败，请刷新 Match View 后重试')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /认.*输/ }));
  await user.click(await screen.findByRole('button', { name: 'OK' }));
  await vi.waitFor(() => expect(forfeit).toHaveBeenLastCalledWith('61', 2));
  await vi.waitFor(() =>
    expect(
      queryClient.getQueryData(['player', 'match', 'current', 'trainer-credential']),
    ).toMatchObject({ status: 'COMPLETED', completionReason: 'FORFEIT', requirements: [] }),
  );
}, 20_000);

it('refreshes the accepted challenge when runtime startup fails', async () => {
  const user = userEvent.setup();
  saveTrainerSessionCredential('trainer-credential');
  vi.spyOn(trainerService, 'list').mockResolvedValue([]);
  vi.spyOn(trainerSessionService, 'current').mockResolvedValue({
    credential: 'trainer-credential',
    expiresAt: '2026-07-12T00:30:00Z',
    trainer: { id: '11', displayName: 'MatchBeta', revision: 0, archivedAt: null },
  });
  vi.spyOn(trainerTeamService, 'get').mockResolvedValue({
    id: '31',
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
  const pending = {
    id: '51',
    direction: 'INCOMING' as const,
    challengerDisplayName: 'MatchAlpha',
    challengedDisplayName: 'MatchBeta',
    ruleCode: 'standard-single',
    teamSize: 1,
    status: 'PENDING' as const,
    revision: 0,
    expiresAt: '2026-07-12T00:05:00Z',
    createdAt: '2026-07-12T00:00:00Z',
  };
  vi.mocked(challengeService.list)
    .mockResolvedValueOnce([pending])
    .mockResolvedValueOnce([pending])
    .mockResolvedValue([{ ...pending, status: 'ACCEPTED', revision: 1 }]);
  vi.spyOn(challengeService, 'accept')
    .mockRejectedValueOnce(
      new ApiError({ code: 'challenge.trainer-offline', message: 'challenge.trainer-offline' }),
    )
    .mockRejectedValue(
      new ApiError({ code: 'match.start-failed', message: 'match.start-failed', matchId: '61' }),
    );

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={queryClient}>
      <PlayHomePage />
    </QueryClientProvider>,
  );

  await user.click(await screen.findByRole('button', { name: /接\s*受/ }));
  expect(await screen.findByText('Challenge 接受失败')).toBeInTheDocument();
  expect(screen.getByText('未能接受 Challenge，请刷新状态后重试。')).toBeInTheDocument();
  await vi.waitFor(() => expect(challengeService.list).toHaveBeenCalledTimes(2));
  await user.click(screen.getByRole('button', { name: /接\s*受/ }));
  expect(await screen.findByText(/对战 61 未能启动/)).toBeInTheDocument();
  expect(
    queryClient.getQueryData(['player', 'match', 'current-reference', 'trainer-credential']),
  ).toBe('61');
  await vi.waitFor(() => expect(challengeService.list).toHaveBeenCalledTimes(3));
  expect(await screen.findByText('ACCEPTED')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /接\s*受/ })).not.toBeInTheDocument();
});
