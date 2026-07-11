import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { battleSessionService } from '../../../services/battle-sessions';
import { ApiError } from '../../../shared/api/errors';
import { BattleSessionCreatePage } from './BattleSessionCreatePage';

const useBattleRuleOptionsMock = vi.hoisted(() => vi.fn());

const loadedOptions = {
  formatOptions: [{ value: 'standard-single', label: '单打' }],
  creatureOptions: [
    { value: '1', label: '妙蛙种子' },
    { value: '2', label: '妙蛙草' },
    { value: '4', label: '小火龙' },
    { value: '5', label: '火恐龙' },
  ],
  skillOptions: [{ value: '1', label: '拍击' }],
  abilityOptions: [],
  itemOptions: [],
  loading: false,
  error: null,
  refetch: vi.fn(),
};

vi.mock('../../battle-rules/shared/useBattleRuleOptions', () => ({
  useBattleRuleOptions: useBattleRuleOptionsMock,
}));

beforeEach(() => {
  useBattleRuleOptionsMock.mockReset();
  useBattleRuleOptionsMock.mockReturnValue({ ...loadedOptions, refetch: vi.fn() });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('creates a session from the roster and opens the server-generated identifier', async () => {
  const user = userEvent.setup();
  vi.spyOn(battleSessionService, 'create').mockResolvedValue({
    sessionId: 'server-session-uuid',
    formatCode: 'standard-single',
    status: 'ACTIVE',
    revision: 0,
    turnNumber: 0,
    createdAt: '2026-07-11T01:00:00Z',
    updatedAt: '2026-07-11T01:00:00Z',
    sides: [],
    turnRequirements: [],
  });

  renderPage();
  await user.click(screen.getByRole('button', { name: '创建会话' }));

  await waitFor(() => expect(battleSessionService.create).toHaveBeenCalledOnce());
  expect(battleSessionService.create).toHaveBeenCalledWith(
    expect.objectContaining({
      formatCode: 'standard-single',
      sides: expect.arrayContaining([expect.objectContaining({ activeParticipantIndexes: [0] })]),
    }),
  );
  expect(await screen.findByText('已打开 server-session-uuid')).toBeInTheDocument();
});

it('shows node capacity exhaustion without leaving the roster form', async () => {
  const user = userEvent.setup();
  vi.spyOn(battleSessionService, 'create').mockRejectedValue(
    new ApiError({
      code: 'battle-session.capacity-exhausted',
      message: '当前节点容量已满',
    }),
  );

  renderPage();
  await user.click(screen.getByRole('button', { name: '创建会话' }));

  expect(await screen.findByText('当前节点容量已满')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '创建会话' })).toBeInTheDocument();
});

it('disables creation while roster options are loading', () => {
  useBattleRuleOptionsMock.mockReturnValue({ ...loadedOptions, loading: true });

  renderPage();

  expect(screen.getByRole('button', { name: /创建会话/ })).toBeDisabled();
});

it('shows and retries a roster option loading failure', async () => {
  const user = userEvent.setup();
  const refetch = vi.fn();
  useBattleRuleOptionsMock.mockReturnValue({
    ...loadedOptions,
    error: new Error('资料连接中断'),
    refetch,
  });

  renderPage();

  expect(screen.getByText('阵容选项加载失败')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /创建会话/ })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: '重新加载选项' }));
  expect(refetch).toHaveBeenCalledOnce();
});

it('shows an empty state when required roster options are unavailable', () => {
  useBattleRuleOptionsMock.mockReturnValue({ ...loadedOptions, formatOptions: [] });

  renderPage();

  expect(screen.getByText('缺少可用的阵容选项')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /创建会话/ })).toBeDisabled();
});

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MemoryRouter initialEntries={['/battle-sessions/new']}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/battle-sessions/new" element={<BattleSessionCreatePage />} />
          <Route
            path="/battle-sessions/:sessionId"
            element={<div>已打开 server-session-uuid</div>}
          />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}
