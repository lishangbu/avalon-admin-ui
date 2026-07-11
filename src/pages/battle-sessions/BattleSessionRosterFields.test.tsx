import { Form } from 'antd';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BattleSessionRosterFields } from './BattleSessionRosterFields';

const options = {
  formatOptions: [{ value: 'standard-single', label: '单打' }],
  creatureOptions: [{ value: '1', label: '妙蛙种子' }],
  skillOptions: [{ value: '1', label: '拍击' }],
  abilityOptions: [{ value: '1', label: '茂盛' }],
  itemOptions: [{ value: '1', label: '文柚果' }],
};

it('collects only server-authorized roster fields', () => {
  render(
    <Form
      layout="vertical"
      initialValues={{
        formatCode: 'standard-single',
        sides: [
          {
            activeParticipantIndexes: [0],
            participants: [{ creatureId: '1', level: 50, skillIds: ['1'] }],
          },
          {
            activeParticipantIndexes: [0],
            participants: [{ creatureId: '1', level: 50, skillIds: ['1'] }],
          },
        ],
      }}
    >
      <BattleSessionRosterFields options={options} />
    </Form>,
  );

  expect(screen.getByLabelText('战斗赛制')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '甲方阵容' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '乙方阵容' })).toBeInTheDocument();
  expect(screen.queryByLabelText('随机种子')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('队伍标识')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('成员标识')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('状态 JSON')).not.toBeInTheDocument();
});

it('adds a roster member without exposing client-owned actor identity', () => {
  render(
    <Form
      layout="vertical"
      initialValues={{
        formatCode: 'standard-single',
        sides: [
          {
            activeParticipantIndexes: [0],
            participants: [{ creatureId: '1', level: 50, skillIds: ['1'] }],
          },
        ],
      }}
    >
      <BattleSessionRosterFields options={options} />
    </Form>,
  );

  const firstSide = screen.getByRole('heading', { name: '甲方阵容' }).closest('section');
  if (!firstSide) {
    throw new Error('未找到甲方阵容区域');
  }
  expect(within(firstSide).getAllByText(/成员 \d/)).toHaveLength(1);

  fireEvent.click(within(firstSide).getByRole('button', { name: /添加成员/ }));

  expect(within(firstSide).getAllByText(/成员 \d/)).toHaveLength(2);
  expect(screen.queryByLabelText('成员标识')).not.toBeInTheDocument();
});
