import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { TerrainRulesPage } from './TerrainRulesPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      terrainRules: {
        ...actual.battleRulesServices.terrainRules,
        list: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.mocked(battleRulesServices.terrainRules.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        code: 'electric-terrain',
        name: '电气场地',
        effectPolicy: 'terrain-electric',
        defaultDurationTurns: 5,
        enabled: true,
        sortOrder: 10,
        description: '测试场地规则中文展示',
      },
    ],
    totalRowCount: 1,
  });
});

it('renders terrain rule policy labels in Chinese and opens select based editors', async () => {
  const user = userEvent.setup();
  renderWithQuery(<TerrainRulesPage />);

  expect(screen.getByRole('heading', { name: '场地规则' })).toBeInTheDocument();
  await waitFor(() => expect(battleRulesServices.terrainRules.list).toHaveBeenCalled());

  expect((await screen.findAllByText('电气场地')).length).toBeGreaterThanOrEqual(2);

  await user.click(screen.getByRole('button', { name: /新建场地/ }));

  expect(await screen.findByText('新建场地规则')).toBeInTheDocument();
  expect(screen.getAllByText('效果策略').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
});
