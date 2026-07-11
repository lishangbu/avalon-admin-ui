import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { BattleSessionLifecyclePanel } from './BattleSessionLifecyclePanel';

it('offers termination only while the session is active', () => {
  render(
    <BattleSessionLifecyclePanel
      status="ACTIVE"
      revision={3}
      turnNumber={2}
      createdAt="2026-07-11T01:00:00Z"
      updatedAt="2026-07-11T01:05:00Z"
      onTerminate={vi.fn()}
    />,
  );

  expect(screen.getByText('运行中')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '终止会话' })).toBeInTheDocument();
  expect(screen.queryByText('终态只读')).not.toBeInTheDocument();
});

it.each([
  ['COMPLETED', '已完成'],
  ['TERMINATED', '已终止'],
])('renders %s as a read-only recent session with its expiry', (status, statusText) => {
  render(
    <BattleSessionLifecyclePanel
      status={status}
      revision={5}
      turnNumber={4}
      createdAt="2026-07-11T01:00:00Z"
      updatedAt="2026-07-11T01:10:00Z"
      endedAt="2026-07-11T01:10:00Z"
      expiresAt="2026-07-11T01:25:00Z"
      onTerminate={vi.fn()}
    />,
  );

  expect(screen.getByText(statusText)).toBeInTheDocument();
  expect(screen.getByText('终态只读')).toBeInTheDocument();
  expect(screen.getByText('2026-07-11T01:25:00Z')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '终止会话' })).not.toBeInTheDocument();
});
