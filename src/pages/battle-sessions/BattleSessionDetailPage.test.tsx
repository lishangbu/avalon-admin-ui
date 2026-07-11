import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import {
  battleSessionService,
  type BattleSessionResponse,
  type BattleSessionTurnRecordResponse,
} from '../../services/battle-sessions';
import { ApiError } from '../../shared/api/errors';
import { BattleSessionDetailPage } from './BattleSessionDetailPage';

afterEach(() => {
  vi.restoreAllMocks();
});

it('submits an exact requirement option and terminates with an auditable reason', async () => {
  const user = userEvent.setup();
  const activeSession = createActiveSession();
  const advancedSession = { ...activeSession, revision: 2, turnNumber: 1, turnRequirements: [] };
  vi.spyOn(globalThis.crypto, 'randomUUID')
    .mockReturnValueOnce('00000000-0000-4000-8000-000000000001')
    .mockReturnValueOnce('00000000-0000-4000-8000-000000000002');
  vi.spyOn(battleSessionService, 'get').mockResolvedValue(activeSession);
  vi.spyOn(battleSessionService, 'listTurns').mockResolvedValue({
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  });
  vi.spyOn(battleSessionService, 'submitTurn').mockResolvedValue({
    session: advancedSession,
    turnRecord: createTurnRecord(),
  });
  vi.spyOn(battleSessionService, 'terminate').mockResolvedValue({
    ...advancedSession,
    status: 'TERMINATED',
    revision: 3,
    endedAt: '2026-07-11T01:10:00Z',
    expiresAt: '2026-07-11T01:25:00Z',
    termination: {
      commandId: '00000000-0000-4000-8000-000000000002',
      reason: '管理员终止',
      revisionBefore: 2,
      revisionAfter: 3,
      terminatedAt: '2026-07-11T01:10:00Z',
    },
  });

  renderPage();

  expect(await screen.findByText('session-uuid')).toBeInTheDocument();
  expect(battleSessionService.get).toHaveBeenCalledWith('session-uuid');
  await user.click(await screen.findByRole('radio', { name: /使用技能 101/ }));
  await user.click(screen.getByRole('button', { name: '提交完整回合' }));

  await waitFor(() => expect(battleSessionService.submitTurn).toHaveBeenCalledOnce());
  expect(battleSessionService.submitTurn).toHaveBeenCalledWith('session-uuid', {
    commandId: '00000000-0000-4000-8000-000000000001',
    expectedRevision: 1,
    actions: activeSession.turnRequirements[0]?.options,
  });

  await user.click(await screen.findByRole('button', { name: '终止会话' }));
  await user.click(screen.getByRole('button', { name: '确认终止' }));

  await waitFor(() => expect(battleSessionService.terminate).toHaveBeenCalledOnce());
  expect(battleSessionService.terminate).toHaveBeenCalledWith('session-uuid', {
    commandId: '00000000-0000-4000-8000-000000000002',
    expectedRevision: 2,
    reason: '管理员终止',
  });
  expect(await screen.findByText('终态只读')).toBeInTheDocument();
});

it('retries a network failure with the same turn command id', async () => {
  const user = userEvent.setup();
  const activeSession = createActiveSession();
  vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000009');
  vi.spyOn(battleSessionService, 'get').mockResolvedValue(activeSession);
  vi.spyOn(battleSessionService, 'listTurns').mockResolvedValue({
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  });
  vi.spyOn(battleSessionService, 'submitTurn')
    .mockRejectedValueOnce(new Error('网络连接中断'))
    .mockResolvedValueOnce({
      session: { ...activeSession, revision: 2, turnNumber: 1, turnRequirements: [] },
      turnRecord: createTurnRecord(),
    });

  renderPage();
  await user.click(await screen.findByRole('radio', { name: /使用技能 101/ }));
  await user.click(screen.getByRole('button', { name: '提交完整回合' }));

  expect(await screen.findByText('回合提交失败')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '使用相同命令重试' }));

  await waitFor(() => expect(battleSessionService.submitTurn).toHaveBeenCalledTimes(2));
  const firstCommand = vi.mocked(battleSessionService.submitTurn).mock.calls.at(0)?.at(1);
  const secondCommand = vi.mocked(battleSessionService.submitTurn).mock.calls.at(1)?.at(1);
  expect(firstCommand?.commandId).toBe('00000000-0000-4000-8000-000000000009');
  expect(secondCommand).toEqual(firstCommand);
});

it('refreshes the session and clears choices after a revision conflict', async () => {
  const user = userEvent.setup();
  const activeSession = createActiveSession();
  vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000010');
  vi.spyOn(battleSessionService, 'get')
    .mockResolvedValueOnce(activeSession)
    .mockResolvedValueOnce({ ...activeSession, revision: 2 });
  vi.spyOn(battleSessionService, 'listTurns').mockResolvedValue({
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  });
  vi.spyOn(battleSessionService, 'submitTurn').mockRejectedValue(
    new ApiError({ code: 'resource.conflict', message: 'revision 已变化' }),
  );

  renderPage();
  await user.click(await screen.findByRole('radio', { name: /使用技能 101/ }));
  await user.click(screen.getByRole('button', { name: '提交完整回合' }));
  expect(await screen.findByText('会话状态已更新')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '刷新并重新选择' }));

  await waitFor(() => expect(battleSessionService.get).toHaveBeenCalledTimes(2));
  expect(await screen.findByText('2')).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: /使用技能 101/ })).not.toBeChecked();
});

it('explains when a session was not found or has left the recent cache', async () => {
  vi.spyOn(battleSessionService, 'get').mockRejectedValue(
    new ApiError({ code: 'resource.not_found', message: '战斗会话不存在或已被淘汰' }),
  );
  vi.spyOn(battleSessionService, 'listTurns').mockResolvedValue({
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  });

  renderPage();

  expect(await screen.findByText('会话不存在或已淘汰')).toBeInTheDocument();
  expect(screen.getByText(/Recent Session/)).toBeInTheDocument();
});

it('shows the eviction state when the turn history has left the recent cache', async () => {
  vi.spyOn(battleSessionService, 'get').mockResolvedValue(createActiveSession());
  vi.spyOn(battleSessionService, 'listTurns').mockRejectedValue(
    new ApiError({ code: 'resource.not_found', message: '战斗会话不存在或已被淘汰' }),
  );

  renderPage();

  expect(await screen.findByText('会话不存在或已淘汰')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '提交完整回合' })).not.toBeInTheDocument();
});

it('surfaces a retryable error when turn history loading fails', async () => {
  const user = userEvent.setup();
  vi.spyOn(battleSessionService, 'get').mockResolvedValue(createActiveSession());
  vi.spyOn(battleSessionService, 'listTurns')
    .mockRejectedValueOnce(new Error('网络连接中断'))
    .mockResolvedValueOnce({ rows: [], totalRowCount: 0, totalPageCount: 0 });

  renderPage();

  expect(await screen.findByText('回合记录加载失败')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '重新加载回合记录' }));

  await waitFor(() => expect(battleSessionService.listTurns).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(screen.queryByText('回合记录加载失败')).not.toBeInTheDocument());
});

it('shows the eviction state when turn submission reports that the session is gone', async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000012');
  vi.spyOn(battleSessionService, 'get').mockResolvedValue(createActiveSession());
  vi.spyOn(battleSessionService, 'listTurns').mockResolvedValue({
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  });
  vi.spyOn(battleSessionService, 'submitTurn').mockRejectedValue(
    new ApiError({ code: 'resource.not_found', message: '战斗会话不存在或已被淘汰' }),
  );

  renderPage();
  await user.click(await screen.findByRole('radio', { name: /使用技能 101/ }));
  await user.click(screen.getByRole('button', { name: '提交完整回合' }));

  expect(await screen.findByText('会话不存在或已淘汰')).toBeInTheDocument();
  expect(screen.queryByText('回合提交失败')).not.toBeInTheDocument();
});

it('shows the eviction state when termination reports that the session is gone', async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000013');
  vi.spyOn(battleSessionService, 'get').mockResolvedValue(createActiveSession());
  vi.spyOn(battleSessionService, 'listTurns').mockResolvedValue({
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  });
  vi.spyOn(battleSessionService, 'terminate').mockRejectedValue(
    new ApiError({ code: 'resource.not_found', message: '战斗会话不存在或已被淘汰' }),
  );

  renderPage();
  await user.click(await screen.findByRole('button', { name: '终止会话' }));
  await user.click(screen.getByRole('button', { name: '确认终止' }));

  expect(await screen.findByText('会话不存在或已淘汰')).toBeInTheDocument();
  expect(screen.queryByText('会话终止失败')).not.toBeInTheDocument();
});

it('refreshes instead of retrying a stale termination command after a conflict', async () => {
  const user = userEvent.setup();
  const activeSession = createActiveSession();
  vi.spyOn(globalThis.crypto, 'randomUUID')
    .mockReturnValueOnce('00000000-0000-4000-8000-000000000014')
    .mockReturnValueOnce('00000000-0000-4000-8000-000000000015');
  vi.spyOn(battleSessionService, 'get')
    .mockResolvedValueOnce(activeSession)
    .mockResolvedValueOnce({ ...activeSession, revision: 2 });
  vi.spyOn(battleSessionService, 'listTurns').mockResolvedValue({
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  });
  vi.spyOn(battleSessionService, 'terminate')
    .mockRejectedValueOnce(new ApiError({ code: 'resource.conflict', message: 'revision 已变化' }))
    .mockRejectedValueOnce(new Error('网络连接中断'));

  renderPage();
  await user.click(await screen.findByRole('button', { name: '终止会话' }));
  await user.click(screen.getByRole('button', { name: '确认终止' }));

  expect(await screen.findByText('会话状态已更新')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '使用相同终止命令重试' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '刷新会话状态' }));

  await waitFor(() => expect(battleSessionService.get).toHaveBeenCalledTimes(2));
  expect(battleSessionService.terminate).toHaveBeenCalledOnce();
  expect(await screen.findByText('2')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /终止会话/ }));
  await user.click(screen.getByRole('button', { name: '确认终止' }));
  await waitFor(() => expect(battleSessionService.terminate).toHaveBeenCalledTimes(2));
  expect(vi.mocked(battleSessionService.terminate).mock.calls.at(1)?.at(1)).toEqual({
    commandId: '00000000-0000-4000-8000-000000000015',
    expectedRevision: 2,
    reason: '管理员终止',
  });
});

it('retries termination with the same idempotency command', async () => {
  const user = userEvent.setup();
  const activeSession = createActiveSession();
  const terminatedSession: BattleSessionResponse = {
    ...activeSession,
    status: 'TERMINATED',
    revision: 2,
    endedAt: '2026-07-11T01:10:00Z',
    expiresAt: '2026-07-11T01:25:00Z',
    termination: {
      commandId: '00000000-0000-4000-8000-000000000011',
      reason: '管理员终止',
      revisionBefore: 1,
      revisionAfter: 2,
      terminatedAt: '2026-07-11T01:10:00Z',
    },
  };
  vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000011');
  vi.spyOn(battleSessionService, 'get').mockResolvedValue(activeSession);
  vi.spyOn(battleSessionService, 'listTurns').mockResolvedValue({
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  });
  vi.spyOn(battleSessionService, 'terminate')
    .mockRejectedValueOnce(new Error('网络连接中断'))
    .mockResolvedValueOnce(terminatedSession);

  renderPage();
  await user.click(await screen.findByRole('button', { name: '终止会话' }));
  await user.click(screen.getByRole('button', { name: '确认终止' }));
  expect(await screen.findByText('会话终止失败')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '使用相同终止命令重试' }));

  await waitFor(() => expect(battleSessionService.terminate).toHaveBeenCalledTimes(2));
  const firstCommand = vi.mocked(battleSessionService.terminate).mock.calls.at(0)?.at(1);
  const secondCommand = vi.mocked(battleSessionService.terminate).mock.calls.at(1)?.at(1);
  expect(secondCommand).toEqual(firstCommand);
});

function createActiveSession(): BattleSessionResponse {
  return {
    sessionId: 'session-uuid',
    formatCode: 'standard-single',
    status: 'ACTIVE',
    revision: 1,
    turnNumber: 0,
    createdAt: '2026-07-11T01:00:00Z',
    updatedAt: '2026-07-11T01:05:00Z',
    sides: [
      {
        sideId: 'side-a',
        activeActorIds: ['side-a-1'],
        participants: [
          {
            actorId: 'side-a-1',
            creatureId: '1',
            active: true,
            level: 50,
            currentHp: 100,
            maxHp: 100,
            statStages: {},
            skillSlots: [{ skillId: '101', name: '拍击', remainingPp: 34, maxPp: 35 }],
          },
        ],
      },
    ],
    turnRequirements: [
      {
        actorId: 'side-a-1',
        options: [
          {
            type: 'USE_SKILL',
            actorId: 'side-a-1',
            skillId: '101',
            targetActorId: 'side-b-1',
          },
        ],
      },
    ],
  };
}

function createTurnRecord(): BattleSessionTurnRecordResponse {
  return {
    commandId: '00000000-0000-4000-8000-000000000001',
    revisionBefore: 1,
    revisionAfter: 2,
    turnNumber: 1,
    submittedActions: [],
    randomTrace: [],
    events: [],
    resolvedAt: '2026-07-11T01:06:00Z',
  };
}

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MemoryRouter initialEntries={['/battle-sessions/session-uuid']}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/battle-sessions/:sessionId" element={<BattleSessionDetailPage />} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}
