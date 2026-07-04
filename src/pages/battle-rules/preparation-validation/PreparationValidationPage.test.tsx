import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRuleOptionServices } from '../../../services/battle-rule-options';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { PreparationValidationPage } from './PreparationValidationPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      battleFormats: {
        ...actual.battleRulesServices.battleFormats,
        list: vi.fn(),
      },
      runtime: {
        ...actual.battleRulesServices.runtime,
        validatePreparation: vi.fn(),
      },
    },
  };
});

vi.mock('../../../services/battle-rule-options', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rule-options')>();
  return {
    ...actual,
    battleRuleOptionServices: {
      ...actual.battleRuleOptionServices,
      creatures: vi.fn(),
      skills: vi.fn(),
      abilities: vi.fn(),
      items: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.mocked(battleRulesServices.battleFormats.list).mockResolvedValue({
    rows: [{ id: 1, code: 'official-double', name: '官方双打' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRuleOptionServices.creatures).mockResolvedValue({
    rows: [{ id: 1, code: 'bulbasaur', name: '妙蛙种子' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRuleOptionServices.skills).mockResolvedValue({
    rows: [
      { id: 1, code: 'tackle', name: '撞击' },
      { id: 2, code: 'growl', name: '叫声' },
      { id: 3, code: 'vine-whip', name: '藤鞭' },
      { id: 4, code: 'sleep-powder', name: '催眠粉' },
    ],
    totalRowCount: 4,
  });
  vi.mocked(battleRuleOptionServices.abilities).mockResolvedValue({
    rows: [{ id: 65, code: 'overgrow', name: '茂盛' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRuleOptionServices.items).mockResolvedValue({
    rows: [{ id: 91, code: 'leftovers', name: '剩饭' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRulesServices.runtime.validatePreparation).mockResolvedValue({
    valid: false,
    violations: [
      {
        code: 'duplicate-creature',
        sideId: 'side-a',
        actorId: 'side-a-2',
        resourceId: 1,
        message: '同一队伍不能重复选择成员资料',
      },
    ],
  });
});

it('renders preparation validation options and backend violations', async () => {
  const user = userEvent.setup();
  renderWithQuery(<PreparationValidationPage />);

  expect(screen.getByRole('heading', { name: '准备校验' })).toBeInTheDocument();
  expect(screen.getAllByText('队伍侧编号').length).toBeGreaterThan(0);
  expect(screen.getAllByText('成员编号').length).toBeGreaterThan(0);
  expect(screen.queryByText('队伍侧 ID')).not.toBeInTheDocument();
  expect(screen.queryByText('成员 ID')).not.toBeInTheDocument();
  expect(screen.queryByText('资料 ID')).not.toBeInTheDocument();
  expect(await screen.findByText('官方双打')).toBeInTheDocument();
  expect(screen.getAllByText('妙蛙种子').length).toBeGreaterThan(0);

  await user.click(screen.getByRole('button', { name: '开始校验' }));

  await waitFor(() =>
    expect(battleRulesServices.runtime.validatePreparation).toHaveBeenCalledWith(
      expect.objectContaining({
        formatCode: 'official-double',
        sides: expect.arrayContaining([
          expect.objectContaining({
            sideId: 'side-a',
            activeActorIds: ['side-a-1', 'side-a-2'],
          }),
        ]),
      }),
    ),
  );
  expect(await screen.findByText('准备校验未通过')).toBeInTheDocument();
  expect(screen.getAllByText('关联资料').length).toBeGreaterThan(0);
  expect(within(screen.getByRole('table')).getByText('妙蛙种子')).toBeInTheDocument();
  expect(screen.getByText('duplicate-creature')).toBeInTheDocument();
  expect(screen.getByText('同一队伍不能重复选择成员资料')).toBeInTheDocument();
});
