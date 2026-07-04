import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRuleOptionServices } from '../../../services/battle-rule-options';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { AbilityRulesPage } from './AbilityRulesPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      abilityRules: {
        ...actual.battleRulesServices.abilityRules,
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
      abilities: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.mocked(battleRuleOptionServices.abilities).mockResolvedValue({
    rows: [{ id: 34, code: 'drizzle', name: '降雨' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRulesServices.abilityRules.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        abilityId: 34,
        triggerTiming: 'ON_SWITCH_IN',
        effectPolicy: 'switch-in-weather-rain',
        triggerOrder: 10,
        enabled: true,
        sortOrder: 10,
        description: '测试特性规则中文展示',
      },
    ],
    totalRowCount: 1,
  });
});

it('renders ability rule policy labels in Chinese and opens select based editors', async () => {
  const user = userEvent.setup();
  renderWithQuery(<AbilityRulesPage />);

  expect(screen.getByRole('heading', { name: '特性规则' })).toBeInTheDocument();
  await waitFor(() => expect(battleRulesServices.abilityRules.list).toHaveBeenCalled());

  expect(await screen.findByText('降雨')).toBeInTheDocument();
  expect(screen.getByText('入场时')).toBeInTheDocument();
  expect(screen.getByText('出场设置下雨')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建规则/ }));

  expect(await screen.findByText('新建特性规则')).toBeInTheDocument();
  expect(screen.getAllByText('特性').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('触发时机').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('效果策略').length).toBeGreaterThanOrEqual(2);

  // 过滤栏特性、触发时机和弹窗里的特性/时机/策略都应由 antd Select 渲染为 combobox。
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(5);
});
