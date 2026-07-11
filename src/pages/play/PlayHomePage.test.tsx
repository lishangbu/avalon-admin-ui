import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { trainerService } from '../../services/trainers';
import { PlayHomePage } from './PlayHomePage';

vi.mock('../../app/auth/AuthProvider', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    session: { user: { username: 'player', displayName: '玩家一号' } },
  }),
}));

beforeEach(() => vi.restoreAllMocks());

it('selects a Trainer without claiming a server Trainer Session exists', async () => {
  const user = userEvent.setup();
  vi.spyOn(trainerService, 'list').mockResolvedValue([
    { id: '11', displayName: 'Avalon一号', revision: 0, archivedAt: null },
  ]);

  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <PlayHomePage />
    </QueryClientProvider>,
  );

  await user.click(await screen.findByRole('button', { name: '选择 Trainer' }));
  expect(
    screen.getByText('已选择 Trainer。建立服务端 Trainer Session 后，才能维护队伍并发起挑战。'),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '切换 Trainer' })).toBeInTheDocument();
});
