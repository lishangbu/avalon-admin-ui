import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import {
  battleSessionService,
  type BattleSessionStatus,
  type BattleSessionSummaryResponse,
} from '../../../services/battle-sessions';
import { BattleSessionsPage } from './BattleSessionsPage';

afterEach(() => {
  vi.restoreAllMocks();
});

it('loads active, completed, and terminated sessions into separate resource sections', async () => {
  const user = userEvent.setup();
  const rowsByStatus: Record<BattleSessionStatus, BattleSessionSummaryResponse[]> = {
    ACTIVE: [createSummary('active-session', 'ACTIVE')],
    COMPLETED: [
      {
        ...createSummary('completed-session', 'COMPLETED'),
        result: { winningSideId: 'side-a', reason: 'all-opponents-fainted' },
        expiresAt: '2026-07-11T01:25:00Z',
      },
    ],
    TERMINATED: [
      {
        ...createSummary('terminated-session', 'TERMINATED'),
        terminationReason: '管理员终止',
        expiresAt: '2026-07-11T01:25:00Z',
      },
    ],
  };
  vi.spyOn(battleSessionService, 'list').mockImplementation(async (query) => ({
    rows: query.status ? rowsByStatus[query.status] : [],
    totalRowCount: query.status ? rowsByStatus[query.status].length : 0,
    totalPageCount: 1,
  }));

  renderPage();

  expect(await screen.findByRole('link', { name: 'active-session' })).toHaveAttribute(
    'href',
    '/battle-sessions/active-session',
  );
  expect(screen.getByRole('link', { name: 'completed-session' })).toBeInTheDocument();
  expect(screen.getByText(/side-a/)).toBeInTheDocument();

  await user.click(screen.getByRole('tab', { name: '已终止' }));
  expect(screen.getByRole('link', { name: 'terminated-session' })).toBeInTheDocument();
  expect(screen.getByText('管理员终止')).toBeInTheDocument();
  expect(battleSessionService.list).toHaveBeenCalledTimes(3);
});

function createSummary(
  sessionId: string,
  status: BattleSessionStatus,
): BattleSessionSummaryResponse {
  return {
    sessionId,
    formatCode: 'standard-single',
    status,
    revision: 2,
    turnNumber: 1,
    createdAt: '2026-07-11T01:00:00Z',
    updatedAt: '2026-07-11T01:10:00Z',
  };
}

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <BattleSessionsPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}
