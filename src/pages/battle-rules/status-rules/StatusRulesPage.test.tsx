import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { StatusRulesPage } from './StatusRulesPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      statusRules: {
        ...actual.battleRulesServices.statusRules,
        list: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(battleRulesServices.statusRules.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        code: 'burn',
        name: '灼伤',
        statusKind: 'MAJOR',
        effectPolicy: 'major-burn',
        minTurns: null,
        maxTurns: null,
        enabled: true,
        sortOrder: 10,
        description: '测试状态规则中文展示',
      },
    ],
    totalRowCount: 1,
  });
});

it('renders status rule policy labels in Chinese and opens select based editors', async () => {
  const user = userEvent.setup();
  renderWithQuery(<StatusRulesPage />);

  expect(screen.getByRole('heading', { name: '状态规则' })).toBeInTheDocument();
  await waitFor(() => expect(battleRulesServices.statusRules.list).toHaveBeenCalled());

  expect((await screen.findAllByText('灼伤')).length).toBeGreaterThanOrEqual(2);
  expect(screen.getByText('主要状态')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建状态/ }));

  expect(await screen.findByText('新建状态规则')).toBeInTheDocument();
  expect(screen.getAllByText('状态类型').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('效果策略').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
});
