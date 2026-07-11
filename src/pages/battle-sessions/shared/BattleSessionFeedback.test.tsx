import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ApiError } from '../../../shared/api/errors';
import {
  BattleSessionCapacityError,
  BattleSessionConflictState,
  BattleSessionNotFoundState,
  TerminateBattleSessionButton,
  battleSessionErrorKind,
} from './BattleSessionFeedback';

it.each([
  ['resource.not_found', 'not-found'],
  ['resource.conflict', 'conflict'],
  ['battle-session.capacity-exhausted', 'capacity'],
  ['validation.failed', 'generic'],
] as const)('maps backend error %s to %s feedback', (code, expectedKind) => {
  expect(battleSessionErrorKind(new ApiError({ code, message: '请求失败' }))).toBe(expectedKind);
});

it('explains that a missing battle session may have expired from the recent cache', () => {
  render(<BattleSessionNotFoundState />);

  expect(screen.getByText('会话不存在或已淘汰')).toBeInTheDocument();
  expect(screen.getByText(/Recent Session/)).toBeInTheDocument();
});

it('presents capacity exhaustion as a retryable node-level error', () => {
  render(<BattleSessionCapacityError />);

  expect(screen.getByText('当前节点容量已满')).toBeInTheDocument();
  expect(screen.getByText(/稍后重试/)).toBeInTheDocument();
});

it('requires refreshing and reselecting actions after a revision conflict', async () => {
  const user = userEvent.setup();
  const onRefresh = vi.fn();
  render(<BattleSessionConflictState onRefresh={onRefresh} />);

  expect(screen.getByText('会话状态已更新')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '刷新并重新选择' }));

  expect(onRefresh).toHaveBeenCalledOnce();
});

it('asks for confirmation before terminating an active session', async () => {
  const user = userEvent.setup();
  const onConfirm = vi.fn();
  render(<TerminateBattleSessionButton onConfirm={onConfirm} />);

  await user.click(screen.getByRole('button', { name: '终止会话' }));
  expect(onConfirm).not.toHaveBeenCalled();
  expect(screen.getByText('确认终止这个战斗会话？')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '确认终止' }));
  expect(onConfirm).toHaveBeenCalledOnce();
});
