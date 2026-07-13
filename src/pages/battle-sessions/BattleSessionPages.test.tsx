import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestRouter } from '../../test/TestRouter';
import { afterEach, expect, it, vi } from 'vitest';
import { battleSessionService } from '../../services/battle-sessions';
import { BattleSessionsPage } from './list/BattleSessionsPage';

afterEach(() => {
  vi.restoreAllMocks();
});

it('separates active sessions from recent terminal sessions and links to creation', async () => {
  const user = userEvent.setup();
  vi.spyOn(battleSessionService, 'list').mockResolvedValue({
    rows: [],
    totalRowCount: 0,
    totalPageCount: 0,
  });
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <TestRouter
        initialPath="/battle-sessions"
        path="/battle-sessions"
        routes={[{ path: '/battle-sessions/new', element: <div>创建路由已打开</div> }]}
      >
        <BattleSessionsPage />
      </TestRouter>
    </QueryClientProvider>,
  );

  expect(await screen.findByRole('heading', { name: '活跃会话' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '近期会话' })).toBeInTheDocument();

  await user.click(screen.getByRole('link', { name: '创建会话' }));
  expect(screen.getByText('创建路由已打开')).toBeInTheDocument();
});

function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}
