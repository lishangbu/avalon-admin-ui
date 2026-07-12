import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { trainerService } from '../../services/trainers';
import { trainerSessionService } from '../../services/trainer-session';
import { PlayHomePage } from './PlayHomePage';
import {
  clearTrainerSessionCredential,
  readTrainerSessionCredential,
} from '../../app/auth/trainer-session-storage';

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
