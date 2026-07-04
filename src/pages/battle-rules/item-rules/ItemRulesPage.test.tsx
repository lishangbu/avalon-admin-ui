import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRuleOptionServices } from '../../../services/battle-rule-options';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { ItemRulesPage } from './ItemRulesPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      itemRules: {
        ...actual.battleRulesServices.itemRules,
        list: vi.fn(),
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
      items: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.mocked(battleRuleOptionServices.items).mockResolvedValue({
    rows: [{ id: 91, code: 'leftovers', name: '剩饭' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRulesServices.itemRules.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        itemId: 91,
        triggerTiming: 'HELD_END_TURN',
        effectPolicy: 'leftovers-heal',
        consumable: false,
        triggerOrder: 100,
        enabled: true,
        sortOrder: 10,
        description: '测试道具规则中文展示',
      },
    ],
    totalRowCount: 1,
  });
});

it('renders item rule policy labels in Chinese and opens select based editors', async () => {
  const user = userEvent.setup();
  renderWithQuery(<ItemRulesPage />);

  expect(screen.getByRole('heading', { name: '道具规则' })).toBeInTheDocument();
  await waitFor(() => expect(battleRulesServices.itemRules.list).toHaveBeenCalled());

  expect(await screen.findByText('剩饭')).toBeInTheDocument();
  expect(screen.getByText('持有物回合结束')).toBeInTheDocument();
  expect(screen.getByText('回合末回复体力')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建规则/ }));

  expect(await screen.findByText('新建道具规则')).toBeInTheDocument();
  expect(screen.getAllByText('道具').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('触发时机').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('效果策略').length).toBeGreaterThanOrEqual(2);

  // 过滤栏道具、触发时机和弹窗里的道具/时机/策略都应由 antd Select 渲染为 combobox。
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(5);
});
