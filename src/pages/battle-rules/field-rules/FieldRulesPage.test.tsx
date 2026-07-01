import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { FieldRulesPage } from './FieldRulesPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      fieldRules: {
        ...actual.battleRulesServices.fieldRules,
        list: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(battleRulesServices.fieldRules.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        code: 'reflect',
        name: '反射壁',
        effectScope: 'SIDE',
        effectPolicy: 'side-reflect',
        minTurns: 5,
        maxTurns: 5,
        maxLayers: 1,
        enabled: true,
        sortOrder: 10,
        description: '测试场上效果中文展示',
      },
    ],
    totalRowCount: 1,
  });
});

it('renders field rule policy labels in Chinese and opens select based editors', async () => {
  const user = userEvent.setup();
  renderWithQuery(<FieldRulesPage />);

  expect(screen.getByRole('heading', { name: '场上效果' })).toBeInTheDocument();
  await waitFor(() => expect(battleRulesServices.fieldRules.list).toHaveBeenCalled());

  expect((await screen.findAllByText('反射壁')).length).toBeGreaterThanOrEqual(2);
  expect(screen.getByText('一侧')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建效果/ }));

  expect(await screen.findByText('新建场上效果')).toBeInTheDocument();
  expect(screen.getAllByText('效果范围').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('效果策略').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
});
