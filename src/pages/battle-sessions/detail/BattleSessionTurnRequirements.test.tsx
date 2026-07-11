import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { BattleSessionTurnRequirements } from './BattleSessionTurnRequirements';

const requirements = [
  {
    actorId: 'side-a-1',
    options: [
      {
        type: 'USE_SKILL',
        actorId: 'side-a-1',
        skillId: '101',
        targetActorId: 'side-b-1',
      },
      {
        type: 'SWITCH_PARTICIPANT',
        actorId: 'side-a-1',
        targetActorId: 'side-a-2',
      },
    ],
  },
  {
    actorId: 'side-b-1',
    options: [
      {
        type: 'USE_SKILL',
        actorId: 'side-b-1',
        skillId: '202',
        targetActorId: 'side-a-1',
      },
    ],
  },
];

it('submits one exact backend-provided option for every required actor', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(
    <BattleSessionTurnRequirements revision={8} requirements={requirements} onSubmit={onSubmit} />,
  );

  const submit = screen.getByRole('button', { name: '提交完整回合' });
  expect(submit).toBeDisabled();

  await user.click(screen.getByRole('radio', { name: /side-a-1 使用技能 101/ }));
  expect(submit).toBeDisabled();
  await user.click(screen.getByRole('radio', { name: /side-b-1 使用技能 202/ }));
  expect(submit).toBeEnabled();
  await user.click(submit);

  expect(onSubmit).toHaveBeenCalledWith(
    requirements.flatMap((requirement) => requirement.options.slice(0, 1)),
  );
});

it('advances a turn whose actions are entirely server-derived', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<BattleSessionTurnRequirements revision={10} requirements={[]} onSubmit={onSubmit} />);

  await user.click(screen.getByRole('button', { name: '推进自动回合' }));

  expect(onSubmit).toHaveBeenCalledWith([]);
});

it('clears old choices when the authoritative revision changes', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  const { rerender } = render(
    <BattleSessionTurnRequirements
      revision={8}
      requirements={requirements.slice(0, 1)}
      onSubmit={onSubmit}
    />,
  );

  await user.click(screen.getByRole('radio', { name: /side-a-1 替换为 side-a-2/ }));
  expect(screen.getByRole('button', { name: '提交完整回合' })).toBeEnabled();

  rerender(
    <BattleSessionTurnRequirements
      revision={9}
      requirements={requirements.slice(0, 1)}
      onSubmit={onSubmit}
    />,
  );

  expect(screen.getByRole('button', { name: '提交完整回合' })).toBeDisabled();
  expect(screen.getByRole('radio', { name: /side-a-1 替换为 side-a-2/ })).not.toBeChecked();
});
