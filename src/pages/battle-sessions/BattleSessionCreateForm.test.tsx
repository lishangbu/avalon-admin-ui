import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { BattleSessionCreateForm } from './BattleSessionCreateForm';

const options = {
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
};

it('submits a Session Roster without client-owned runtime fields', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<BattleSessionCreateForm options={options} onSubmit={onSubmit} />);

  await user.click(screen.getByRole('button', { name: /创建会话/ }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  const values = onSubmit.mock.calls.at(0)?.at(0);
  expect(values).toMatchObject({
    formatCode: 'standard-single',
    sides: [
      { activeParticipantIndexes: [0], participants: [{ creatureId: '1' }, { creatureId: '2' }] },
      { activeParticipantIndexes: [0], participants: [{ creatureId: '4' }, { creatureId: '5' }] },
    ],
  });
  expect(values).not.toHaveProperty('randomSeed');
  expect(JSON.stringify(values)).not.toMatch(/sideId|actorId|state/);
});

it('disables roster submission while reference options are loading', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<BattleSessionCreateForm options={options} loadingOptions={true} onSubmit={onSubmit} />);

  const submit = screen.getByRole('button', { name: /创建会话/ });
  expect(submit).toBeDisabled();
  await user.click(submit);
  expect(onSubmit).not.toHaveBeenCalled();
});
