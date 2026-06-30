import { screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import {
  battleRulesServices,
  type BattleRuleCoverageResponse,
} from '../../../services/battle-rules';
import { renderWithQuery } from '../../../test/render-with-query';
import { CoveragePage } from './CoveragePage';

vi.mock('../../../services/battle-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../services/battle-rules')>();
  return {
    ...actual,
    battleRulesServices: {
      ...actual.battleRulesServices,
      coverage: {
        ...actual.battleRulesServices.coverage,
        get: vi.fn(),
      },
    },
  };
});

function getMockCoverage(
  overrides?: Partial<BattleRuleCoverageResponse>,
): BattleRuleCoverageResponse {
  return {
    summary: {
      totalCount: 312,
      implementedCount: 312,
      partialCount: 0,
      plannedCount: 0,
      fixtureCount: 3,
      implementationPercent: 100,
    },
    targetSummary: {
      targetRuleCount: 312,
      coveredRuleCount: 312,
      remainingRuleCount: 0,
      implementationPercent: 100,
      coverageItemCount: 12,
      basis: '现代主系列规则',
    },
    fixtureSummary: {
      runtimeAvailable: true,
      fixtureReferenceCount: 3,
      matchedFixtureCount: 3,
      missingFixtureCount: 0,
      latestPassedCount: 0,
      latestFailedCount: 0,
      latestRunningCount: 0,
      withoutRunCount: 0,
    },
    matrix: [
      {
        category: '最终规则',
        totalCount: 1,
        implementedCount: 1,
        partialCount: 0,
        plannedCount: 0,
        fixtureCount: 1,
        implementationPercent: 100,
      },
    ],
    checks: [
      {
        code: 'golden-replay',
        name: 'Golden Replay 对照',
        status: 'PASSED',
        message: '严格 replay 已纳入单元测试覆盖。',
      },
    ],
    items: [
      {
        code: 'random-replay-public-reference',
        name: '随机、回放和对照测试基础',
        category: '随机/回放',
        status: 'IMPLEMENTED',
        ruleCount: 4,
        fixtureNames: [
          'ScriptedBattleRandomTests.kt',
          'BattleReplayRecorderTests.kt',
          'BattleReplayPublicReferenceTests.kt',
        ],
        fixtures: [
          {
            code: 'BattleReplayPublicReferenceTests.kt',
            fixtureId: null,
            name: '单元测试',
            enabled: true,
            latestRunCode: null,
            latestRunStatus: null,
            latestRunStartedAt: null,
            missing: false,
          },
        ],
        note: '覆盖固定随机序列、事件流稳定、回放复算和公开对照测试元数据。',
      },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(battleRulesServices.coverage.get).mockResolvedValue(getMockCoverage());
});

it('renders battle rule coverage summary and public reference rows', async () => {
  renderWithQuery(<CoveragePage />);

  expect(screen.getByRole('heading', { name: '规则覆盖' })).toBeInTheDocument();

  await waitFor(() => expect(battleRulesServices.coverage.get).toHaveBeenCalled());
  expect(await screen.findByText('随机、回放和对照测试基础')).toBeInTheDocument();
  expect(screen.getByText('完整性校验')).toBeInTheDocument();
  expect(screen.getByText('规则覆盖矩阵')).toBeInTheDocument();
  expect(screen.getByText('Golden Replay 对照')).toBeInTheDocument();
  expect(screen.getByText('golden-replay')).toBeInTheDocument();
  expect(screen.getByText('严格 replay 已纳入单元测试覆盖。')).toBeInTheDocument();
  expect(screen.getByText('random-replay-public-reference')).toBeInTheDocument();
  expect(screen.getByText('BattleReplayPublicReferenceTests.kt')).toBeInTheDocument();
  expect(screen.getAllByText('已实现').length).toBeGreaterThan(0);
  expect(screen.getAllByText('随机/回放').length).toBeGreaterThan(0);
  expect(
    screen.getByText('覆盖固定随机序列、事件流稳定、回放复算和公开对照测试元数据。'),
  ).toBeInTheDocument();
});
