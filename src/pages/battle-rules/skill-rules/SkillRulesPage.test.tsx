import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { battleRuleOptionServices } from '../../../services/battle-rule-options';
import { battleRulesServices } from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { SkillRulesPage } from './SkillRulesPage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      skillRules: {
        ...actual.battleRulesServices.skillRules,
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
      skills: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.mocked(battleRuleOptionServices.skills).mockResolvedValue({
    rows: [{ id: 85, code: 'thunder-wave', name: '电磁波' }],
    totalRowCount: 1,
  });
  vi.mocked(battleRulesServices.skillRules.list).mockResolvedValue({
    rows: [
      {
        id: 1,
        skillId: 85,
        effectPolicy: 'stat-stage-change',
        targetPolicy: 'all-opponents',
        hitPolicy: 'standard-hit',
        damagePolicy: 'no-damage',
        minHits: 1,
        maxHits: 1,
        criticalHitStage: 0,
        makesContact: false,
        affectedByProtect: true,
        protectsUser: false,
        thawsUserBeforeMove: false,
        weakenedByGrassyTerrain: false,
        chargesBeforeUse: false,
        rechargesAfterUse: false,
        soundBased: false,
        powderBased: false,
        punchBased: false,
        slicingBased: false,
        lockMoveTurnsMin: 1,
        lockMoveTurnsMax: 1,
        confusesUserAfterLock: false,
        forceTargetSwitch: false,
        enabled: true,
        sortOrder: 10,
        description: '测试策略中文展示',
      },
    ],
    totalRowCount: 1,
  });
});

it('renders skill rule policy labels in Chinese and opens select based editors', async () => {
  const user = userEvent.setup();
  renderWithQuery(<SkillRulesPage />);

  expect(screen.getByRole('heading', { name: '技能规则' })).toBeInTheDocument();
  await waitFor(() => expect(battleRulesServices.skillRules.list).toHaveBeenCalled());

  expect(await screen.findByText('电磁波')).toBeInTheDocument();
  expect(await screen.findByText('能力阶级变化')).toBeInTheDocument();
  expect(screen.getByText('全部相邻对手')).toBeInTheDocument();
  expect(screen.getByText('标准命中')).toBeInTheDocument();
  expect(screen.getByText('无伤害')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /新建规则/ }));

  expect(await screen.findByText('新建技能规则')).toBeInTheDocument();
  expect(screen.getAllByText('主效果策略').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('目标策略').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('命中策略').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText('伤害策略').length).toBeGreaterThanOrEqual(2);

  // 过滤栏技能下拉、弹窗技能下拉，以及四个策略下拉都应由 antd Select 渲染为 combobox。
  expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(6);
});
